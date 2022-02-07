import { ApplyOptions } from "@sapphire/decorators";
import { ApplicationCommandRegistry, Command } from "@sapphire/framework";
import { CommandInteraction, MessageEmbed } from "discord.js";

@ApplyOptions<Command.Options>({
    name: "answer",
    description: "Answers commands."
})
export class AnswerCommand extends Command {
    public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
        registry.registerChatInputCommand({
            name: this.name,
            description: this.description,
            options: [
                {
                    type: "SUB_COMMAND",
                    name: "add",
                    description: "Adds an answer to a question.",
                    options: [
                        {
                            type: "INTEGER",
                            name: "question",
                            description: "The ID of the question.",
                            required: true,
                            autocomplete: true
                        },
                        {
                            type: "STRING",
                            name: "answer",
                            description: "An answer to the question.",
                            required: true
                        },
                        {
                            type: "BOOLEAN",
                            name: "correct",
                            description: "Whether the answer is correct.",
                            required: true
                        }
                    ]
                },
                {
                    type: "SUB_COMMAND",
                    name: "edit",
                    description: "Edits an answer to a question.",
                    options: [
                        {
                            type: "INTEGER",
                            name: "id",
                            description: "The ID of the answer.",
                            required: true,
                            autocomplete: true
                        },
                        {
                            type: "STRING",
                            name: "answer",
                            description: "The new answer."
                        },
                        {
                            type: "BOOLEAN",
                            name: "correct",
                            description: "Whether the answer is correct."
                        }
                    ]
                },
                {
                    type: "SUB_COMMAND",
                    name: "remove",
                    description: "Removes an answer to a question.",
                    options: [{
                        type: "INTEGER",
                        name: "answer",
                        description: "The ID of the answer.",
                        required: true,
                        autocomplete: true
                    }]
                }
            ]
        }, {
            idHints: ["940328534226907226"]
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
            default:
                return interaction.reply({
                    content: "Unknown command.",
                    ephemeral: true
                });
        }
    }

    private async add(interaction: CommandInteraction) {
        await interaction.deferReply({ ephemeral: true });

        const question = await this.container.prisma.quizQuestion.findUnique({
            where: {
                id: interaction.options.getInteger("question", true)
            }
        });

        if (!question) {
            return interaction.editReply({
                embeds: [
                    new MessageEmbed({
                        color: "RED",
                        title: "Question not found",
                        description: "The question you specified does not exist."
                    })
                ]
            })
        }

        const answer = await this.container.prisma.quizAnswer.create({
            data: {
                quizQuestion: { connect: { id: question.id } },
                answer: interaction.options.getString("answer", true),
                isCorrect: interaction.options.getBoolean("correct", true)
            }
        });

        return interaction.editReply({
            embeds: [
                new MessageEmbed({
                    color: "GREEN",
                    title: "Answer added",
                    description: `Added answer \`${answer.id}\` to question \`${question.id}\`.`
                })
            ]
        });
    }

    private async edit(interaction: CommandInteraction) {
        await interaction.deferReply({ ephemeral: true });

        const answer = await this.container.prisma.quizAnswer.findUnique({
            where: {
                id: interaction.options.getInteger("id", true)
            }
        });

        if (!answer) {
            return interaction.editReply({
                embeds: [
                    new MessageEmbed({
                        color: "RED",
                        title: "Answer not found",
                        description: "The answer you specified does not exist."
                    })
                ]
            })
        }

        await this.container.prisma.quizAnswer.update({
            where: { id: answer.id },
            data: {
                answer: interaction.options.getString("answer") ?? answer.answer,
                isCorrect: interaction.options.getBoolean("correct") ?? answer.isCorrect
            }
        });

        return interaction.editReply({
            embeds: [
                new MessageEmbed({
                    color: "GREEN",
                    title: "Answer edited",
                    description: `Edited answer \`${answer.id}\`.`
                })
            ]
        });
    }

    private async remove(interaction: CommandInteraction) {
        await interaction.deferReply({ ephemeral: true });

        const answer = await this.container.prisma.quizAnswer.findUnique({
            where: {
                id: interaction.options.getInteger("answer", true)
            }
        });

        if (!answer) {
            return interaction.editReply({
                embeds: [
                    new MessageEmbed({
                        color: "RED",
                        title: "Answer not found",
                        description: "The answer you specified does not exist."
                    })
                ]
            })
        }

        await this.container.prisma.quizAnswer.delete({
            where: { id: answer.id }
        });

        return interaction.editReply({
            embeds: [
                new MessageEmbed({
                    color: "GREEN",
                    title: "Answer removed",
                    description: `Removed answer \`${answer.id}\`.`
                })
            ]
        });
    }
}