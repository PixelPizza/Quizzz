import { ApplyOptions } from "@sapphire/decorators";
import { ApplicationCommandRegistry, Command } from "@sapphire/framework";
import { stripIndents } from "common-tags";
import { CommandInteraction, MessageEmbed } from "discord.js";

@ApplyOptions<Command.Options>({
    name: "question",
    description: "Question commands."
})
export class QuestionCommand extends Command {
    public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
        registry.registerChatInputCommand({
            name: this.name,
            description: this.description,
            options: [
                {
                    type: "SUB_COMMAND",
                    name: "add",
                    description: "Add a question.",
                    options: [
                        {
                            type: "INTEGER",
                            name: "quiz",
                            description: "The ID of the quiz.",
                            required: true,
                            autocomplete: true
                        },
                        {
                            type: "STRING",
                            name: "question",
                            description: "The question to add.",
                            required: true
                        },
                        {
                            type: "STRING",
                            name: "image",
                            description: "The image of the question."
                        },
                        {
                            type: "STRING",
                            name: "answer",
                            description: "A description of the correct answer."
                        }
                    ]
                },
                {
                    type: "SUB_COMMAND",
                    name: "edit",
                    description: "Edit a question.",
                    options: [
                        {
                            type: "INTEGER",
                            name: "id",
                            description: "The ID of the question.",
                            required: true,
                            autocomplete: true
                        },
                        {
                            type: "STRING",
                            name: "question",
                            description: "The question to add."
                        },
                        {
                            type: "STRING",
                            name: "image",
                            description: "The image of the question."
                        },
                        {
                            type: "STRING",
                            name: "answer",
                            description: "A description of the correct answer."
                        }
                    ]
                },
                {
                    type: "SUB_COMMAND",
                    name: "remove",
                    description: "Remove a question.",
                    options: [{
                        type: "INTEGER",
                        name: "id",
                        description: "The ID of the question.",
                        required: true,
                        autocomplete: true
                    }]
                },
                {
                    type: "SUB_COMMAND",
                    name: "list",
                    description: "List all questions.",
                    options: [
                        {
                            type: "INTEGER",
                            name: "quiz",
                            description: "The ID of the quiz.",
                            required: true,
                            autocomplete: true
                        }
                    ]
                },
                {
                    type: "SUB_COMMAND",
                    name: "info",
                    description: "Get information about a question.",
                    options: [{
                        type: "INTEGER",
                        name: "id",
                        description: "The ID of the question.",
                        required: true,
                        autocomplete: true
                    }]
                }
            ]
        }, {
            idHints: ["940324494873092116"]
        });
    }

    public override chatInputRun(interaction: CommandInteraction) {
        switch (interaction.options.getSubcommand()) {
            case "add":
                return this.add(interaction);
            case "edit":
                return this.edit(interaction);
            case "remove":
                return this.remove(interaction);
            case "list":
                return this.list(interaction);
            case "info":
                return this.info(interaction);
            default:
                return interaction.reply({
                    content: "Unknown command.",
                    ephemeral: true
                });
        }
    }

    private async add(interaction: CommandInteraction) {
        await interaction.deferReply({ ephemeral: true });

        const question = await this.container.prisma.quizQuestion.create({
            data: {
                quiz: { connect: { id: interaction.options.getInteger("quiz", true) }},
                question: interaction.options.getString("question", true),
                answer: interaction.options.getString("answer"),
                thumbnail: interaction.options.getString("image")
            }
        });

        return interaction.editReply({
            embeds: [
                new MessageEmbed({
                    color: "GREEN",
                    title: "Question added.",
                    description: `Question ID: ${question.id}`
                })
            ]
        });
    }

    private async edit(interaction: CommandInteraction) {
        await interaction.deferReply({ ephemeral: true });

        const id = interaction.options.getInteger("id", true);

        const question = await this.container.prisma.quizQuestion.findUnique({
            where: { id }
        });

        if (!question) {
            return interaction.editReply({
                embeds: [
                    new MessageEmbed({
                        color: "RED",
                        title: "Question not found.",
                        description: `Question ID: ${id}`
                    })
                ]
            });
        }

        await this.container.prisma.quizQuestion.update({
            where: { id },
            data: {
                question: interaction.options.getString("question") ?? question.question,
                answer: interaction.options.getString("answer") ?? question.answer,
                thumbnail: interaction.options.getString("image") ?? question.thumbnail
            }
        });

        return interaction.editReply({
            embeds: [
                new MessageEmbed({
                    color: "GREEN",
                    title: "Question edited.",
                    description: `Question ID: ${id}`
                })
            ]
        });
    }

    private async remove(interaction: CommandInteraction) {
        await interaction.deferReply({ ephemeral: true });

        const id = interaction.options.getInteger("id", true);

        const question = await this.container.prisma.quizQuestion.findUnique({
            where: { id }
        });

        if (!question) {
            return interaction.editReply({
                embeds: [
                    new MessageEmbed({
                        color: "RED",
                        title: "Question not found.",
                        description: `Question ID: ${id}`
                    })
                ]
            });
        }

        await this.container.prisma.quizQuestion.delete({
            where: { id }
        });

        return interaction.editReply({
            embeds: [
                new MessageEmbed({
                    color: "GREEN",
                    title: "Question removed.",
                    description: `Question ID: ${id}`
                })
            ]
        });
    }

    private async list(interaction: CommandInteraction) {
        await interaction.deferReply({ ephemeral: true });

        const quiz = await this.container.prisma.quiz.findUnique({
            where: { id: interaction.options.getInteger("quiz", true) }
        });

        if (!quiz) {
            return interaction.editReply({
                embeds: [
                    new MessageEmbed({
                        color: "RED",
                        title: "Quiz not found.",
                        description: `Quiz ID: ${interaction.options.getInteger("quiz", true)}`
                    })
                ]
            });
        }

        const questions = await this.container.prisma.quizQuestion.findMany({
            where: { quiz: { id: quiz.id }},
            include: { answers: true },
            orderBy: { id: "asc" }
        });

        return interaction.editReply({
            embeds: [
                new MessageEmbed({
                    color: "BLUE",
                    title: "Questions",
                    description: `Quiz ID: ${quiz.id}`,
                    fields: questions.map(question => ({
                        name: `Question ID: ${question.id}`,
                        value: stripIndents`
                            ${question.question}
                            ${question.answers.map(answer => `${answer.isCorrect ? "✅" : "❎"} - \`${answer.answer}\``).join("\n")}
                        `
                    }))
                })
            ]
        });
    }

    private async info(interaction: CommandInteraction) {
        await interaction.deferReply({ ephemeral: true });

        const id = interaction.options.getInteger("id", true);

        const question = await this.container.prisma.quizQuestion.findUnique({
            where: { id },
            include: { answers: true }
        });

        if (!question) {
            return interaction.editReply({
                embeds: [
                    new MessageEmbed({
                        color: "RED",
                        title: "Question not found.",
                        description: `Question ID: ${id}`
                    })
                ]
            });
        }

        const embed = new MessageEmbed({
            color: "BLUE",
            title: "Question",
            description: `Question ID: ${question.id}`,
            fields: [
                {
                    name: "Question",
                    value: question.question
                },
                {
                    name: "Answer Description",
                    value: question.answer ?? "No answer description."
                },
                {
                    name: "Answers",
                    value: question.answers.map(answer => `${answer.isCorrect ? "✅" : "❎"} - \`${answer.answer}\``).join("\n")
                }
            ]
        });

        if (question.thumbnail) embed.setThumbnail(question.thumbnail);

        return interaction.editReply({ embeds: [embed] });
    }
}