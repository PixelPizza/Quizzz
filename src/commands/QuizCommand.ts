import type { Prisma, QuizAnswer, QuizQuestion } from "@prisma/client";
import { ApplyOptions } from "@sapphire/decorators";
import { ApplicationCommandRegistry, Command } from "@sapphire/framework";
import { CommandInteraction, Message, MessageActionRow, MessageEmbed, MessageSelectMenu, SelectMenuInteraction } from "discord.js";

enum QuizOrder {
    New = "new",
    Popular = "popular"
}

@ApplyOptions<Command.Options>({
    name: "quiz",
    description: "Quiz commands."
})
export class QuizCommand extends Command {
    public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
        registry.registerChatInputCommand({
            name: this.name,
            description: this.description,
            options: [
                {
                    type: "SUB_COMMAND",
                    name: "create",
                    description: "Create a quiz.",
                    options: [
                        {
                            type: "STRING",
                            name: "name",
                            description: "The name of the quiz.",
                            required: true
                        },
                        {
                            type: "BOOLEAN",
                            name: "public",
                            description: "Whether the quiz is public or not.",
                            required: true
                        },
                        {
                            type: "BOOLEAN",
                            name: "copyable",
                            description: "Whether the quiz is copyable or not.",
                            required: true
                        },
                        {
                            type: "BOOLEAN",
                            name: "random",
                            description: "Whether the questions are randomized or not.",
                            required: true
                        },
                        {
                            type: "STRING",
                            name: "description",
                            description: "The description of the quiz."
                        },
                        {
                            type: "STRING",
                            name: "thumbnail",
                            description: "The thumbnail of the quiz."
                        }
                    ]
                },
                {
                    type: "SUB_COMMAND",
                    name: "edit",
                    description: "Edit a quiz.",
                    options: [
                        {
                            type: "INTEGER",
                            name: "id",
                            description: "The id of the quiz.",
                            required: true,
                            autocomplete: true
                        },
                        {
                            type: "STRING",
                            name: "name",
                            description: "The name of the quiz."
                        },
                        {
                            type: "BOOLEAN",
                            name: "public",
                            description: "Whether the quiz is public or not."
                        },
                        {
                            type: "BOOLEAN",
                            name: "copyable",
                            description: "Whether the quiz is copyable or not."
                        },
                        {
                            type: "BOOLEAN",
                            name: "random",
                            description: "Whether the questions are randomized or not."
                        },
                        {
                            type: "STRING",
                            name: "description",
                            description: "The description of the quiz."
                        },
                        {
                            type: "STRING",
                            name: "thumbnail",
                            description: "The thumbnail of the quiz."
                        }
                    ]
                },
                {
                    type: "SUB_COMMAND",
                    name: "delete",
                    description: "Delete a quiz.",
                    options: [{
                        type: "INTEGER",
                        name: "id",
                        description: "The id of the quiz.",
                        required: true,
                        autocomplete: true
                    }]
                },
                {
                    type: "SUB_COMMAND",
                    name: "list",
                    description: "List all the quizzes.",
                    options: [
                        {
                            type: "STRING",
                            name: "query",
                            description: "The query to search for."
                        },
                        {
                            type: "USER",
                            name: "owner",
                            description: "The owner of the quiz."
                        },
                        {
                            type: "STRING",
                            name: "order",
                            description: "The order of the quizzes.",
                            choices: Object.entries(QuizOrder).map(([key, value]) => ({
                                name: value,
                                value: key
                            }))
                        }
                    ]
                },
                {
                    type: "SUB_COMMAND",
                    name: "info",
                    description: "Get information about a quiz.",
                    options: [{
                        type: "INTEGER",
                        name: "id",
                        description: "The id of the quiz.",
                        required: true,
                        autocomplete: true
                    }]
                },
                {
                    type: "SUB_COMMAND",
                    name: "play",
                    description: "Play a quiz.",
                    options: [{
                        type: "INTEGER",
                        name: "id",
                        description: "The id of the quiz.",
                        required: true,
                        autocomplete: true
                    }]
                },
                {
                    type: "SUB_COMMAND",
                    name: "like",
                    description: "Like or dislike a quiz. (defaults to toggle)",
                    options: [
                        {
                            type: "INTEGER",
                            name: "id",
                            description: "The id of the quiz.",
                            required: true,
                            autocomplete: true
                        },
                        {
                            type: "BOOLEAN",
                            name: "like",
                            description: "Whether to like the quiz or not."
                        }
                    ]
                },
                {
                    type: "SUB_COMMAND",
                    name: "copy",
                    description: "Copy a quiz.",
                    options: [
                        {
                            type: "INTEGER",
                            name: "id",
                            description: "The id of the quiz.",
                            required: true,
                            autocomplete: true
                        },
                        {
                            type: "BOOLEAN",
                            name: "questions",
                            description: "Whether to copy the questions or not.",
                            required: true
                        }
                    ]
                },
                {
                    type: "SUB_COMMAND",
                    name: "share",
                    description: "Share or unshare a private quiz. (defaults to toggle)",
                    options: [
                        {
                            type: "INTEGER",
                            name: "id",
                            description: "The id of the quiz.",
                            required: true,
                            autocomplete: true
                        },
                        {
                            type: "USER",
                            name: "user",
                            description: "The user to share the quiz with.",
                            required: true
                        },
                        {
                            type: "BOOLEAN",
                            name: "share",
                            description: "Whether to share the quiz or not."
                        }
                    ]
                },
                {
                    type: "SUB_COMMAND",
                    name: "report",
                    description: "Report a quiz.",
                    options: [
                        {
                            type: "INTEGER",
                            name: "id",
                            description: "The id of the quiz.",
                            required: true,
                            autocomplete: true
                        },
                        {
                            type: "STRING",
                            name: "reason",
                            description: "The reason for the report.",
                            required: true
                        }
                    ]
                }
            ]
        }, {
            idHints: ["939903447233355837"]
        });
    }

    public override chatInputRun(interaction: CommandInteraction) {
        switch (interaction.options.getSubcommand()) {
            case "create":
                return this.create(interaction);
            case "edit":
                return this.edit(interaction);
            case "delete":
                return this.delete(interaction);
            case "list":
                return this.list(interaction);
            case "info":
                return this.info(interaction);
            case "play":
                return this.play(interaction);
            case "like":
                return this.like(interaction);
            case "copy":
                return this.copy(interaction);
            // case "share":
            //     return this.share(interaction);
            // case "report":
            //     return this.report(interaction);
            default:
                return interaction.reply({
                    content: "Unknown command.",
                    ephemeral: true
                });
        }
    }

    private validateThumbnail(thumbnail: string | null) {
        if (thumbnail !== null && !/https?:\/\/.*/.test(thumbnail))
            throw new Error("Invalid thumbnail.");
        return thumbnail;
    }

    private async create(interaction: CommandInteraction) {
        await interaction.deferReply({ ephemeral: true });

        try {
            const quiz = await this.container.prisma.quiz.create({
                data: {
                    owner: interaction.user.id,
                    name: interaction.options.getString("name", true),
                    description: interaction.options.getString("description"),
                    thumbnail: this.validateThumbnail(interaction.options.getString("thumbnail")),
                    public: interaction.options.getBoolean("public", true),
                    copyable: interaction.options.getBoolean("copyable", true),
                    random: interaction.options.getBoolean("random", true)
                }
            });
    
            await interaction.editReply({
                embeds: [
                    new MessageEmbed({
                        color: "BLUE",
                        title: "Quiz Created",
                        description: `Created a new quiz with the id \`${quiz.id}\`.`
                    })
                ]
            });
        } catch (error) {
            if (error instanceof Error) {
                await interaction.editReply({
                    embeds: [
                        new MessageEmbed({
                            color: "RED",
                            title: "Error",
                            description: error.message
                        })
                    ]
                });
            }
        }
    }

    private async edit(interaction: CommandInteraction): Promise<any> {
        await interaction.deferReply({ ephemeral: true });

        const quiz = await this.container.prisma.quiz.findUnique({
            where: {
                id: interaction.options.getInteger("id", true)
            }
        });

        if (!quiz) {
            return interaction.editReply({
                embeds: [
                    new MessageEmbed({
                        color: "RED",
                        title: "Quiz Not Found",
                        description: "The quiz you specified could not be found."
                    })
                ]
            });
        }

        if (quiz.owner !== interaction.user.id) {
            return interaction.editReply({
                embeds: [
                    new MessageEmbed({
                        color: "RED",
                        title: "Not Authorized",
                        description: "You are not the owner of this quiz."
                    })
                ]
            });
        }

        try {
            await this.container.prisma.quiz.update({
                where: {
                    id: quiz.id
                },
                data: {
                    name: interaction.options.getString("name") ?? quiz.name,
                    public: interaction.options.getBoolean("public") ?? quiz.public,
                    copyable: interaction.options.getBoolean("copyable") ?? quiz.copyable,
                    random: interaction.options.getBoolean("random") ?? quiz.random,
                    description: interaction.options.getString("description") ?? quiz.description,
                    thumbnail: this.validateThumbnail(interaction.options.getString("thumbnail")) ?? quiz.thumbnail
                }
            });

            await interaction.editReply({
                embeds: [
                    new MessageEmbed({
                        color: "GREEN",
                        title: "Quiz Edited",
                        description: "Edited the quiz."
                    })
                ]
            });
        } catch (error) {
            if (error instanceof Error) {
                await interaction.editReply({
                    embeds: [
                        new MessageEmbed({
                            color: "RED",
                            title: "Error",
                            description: error.message
                        })
                    ]
                });
            }
        }
    }

    private async delete(interaction: CommandInteraction) {
        await interaction.deferReply({ ephemeral: true });

        const id = interaction.options.getInteger("id", true);

        await this.container.prisma.quiz.delete({ where: { id } });

        await interaction.editReply({
            embeds: [
                new MessageEmbed({
                    color: "GREEN",
                    title: "Quiz Deleted",
                    description: `Deleted the quiz with the id \`${id}\`.`
                })
            ]
        });
    }

    private async list(interaction: CommandInteraction) {
        await interaction.deferReply({ ephemeral: true });

        const query = interaction.options.getString("query") ?? "";
        const owner = interaction.options.getUser("owner");
        const order = (interaction.options.getString("order") ?? QuizOrder.New) as QuizOrder;

        const where: Prisma.QuizFindManyArgs["where"] = {
            name: {
                contains: query
            }
        };
        if (owner) {
            where.owner = owner.id;
            if (owner.id !== interaction.user.id) {
                where.public = true;
            }
        } else {
            where.OR = {
                public: true,
                owner: interaction.user.id
            }
        }

        const quizzes = await this.container.prisma.quiz.findMany({
            where,
            orderBy: order === QuizOrder.New ? { createdAt: "desc" } : { likes: { _count: "desc" } }
        });

        await interaction.editReply({
            embeds: [
                new MessageEmbed({
                    color: "BLUE",
                    title: "Quizzes",
                    description: `${quizzes.length} quizzes found.`,
                    fields: quizzes.slice(0, 25).map(quiz => ({
                        name: `${quiz.name} (${quiz.id})`,
                        value: quiz.description ?? "No description provided"
                    }))
                })
            ]
        });
    }

    private async info(interaction: CommandInteraction) {
        await interaction.deferReply({ ephemeral: true });

        const id = interaction.options.getInteger("id", true);

        const quiz = await this.container.prisma.quiz.findUnique({
            where: { id },
            include: {
                _count: {
                    select: {
                        likes: true,
                        questions: true
                    }
                }
            }
        });

        if (!quiz) {
            return interaction.editReply({
                embeds: [
                    new MessageEmbed({
                        color: "RED",
                        title: "Quiz Not Found",
                        description: `Could not find a quiz with the id \`${id}\`.`
                    })
                ]
            });
        }

        const embed = new MessageEmbed({
            color: "BLUE",
            title: quiz.name,
            description: quiz.description ?? "No description provided",
            fields: [
                {
                    name: "Owner",
                    value: quiz.owner ? `<@${quiz.owner}>` : "Unknown"
                },
                {
                    name: "Created At",
                    value: `<t:${Math.floor(quiz.createdAt.getTime() / 1000)}>`
                },
                {
                    name: "\u200b",
                    value: "\u200b"
                },
                {
                    name: "Public",
                    value: quiz.public ? "Yes" : "No",
                    inline: true
                },
                {
                    name: "Copyable",
                    value: quiz.copyable ? "Yes" : "No",
                    inline: true
                },
                {
                    name: "Random",
                    value: quiz.random ? "Yes" : "No",
                    inline: true
                },
                {
                    name: "\u200b",
                    value: "\u200b"
                },
                {
                    name: "Likes",
                    value: quiz._count.likes.toString(),
                    inline: true
                },
                {
                    name: "Questions",
                    value: quiz._count.questions.toString(),
                    inline: true
                }
            ]
        });

        if (quiz.thumbnail) embed.setThumbnail(quiz.thumbnail);

        return interaction.editReply({ embeds: [embed] });
    }

    private shuffle<T>(array: T[]): T[] {
        let currentIndex = array.length;
        let randomIndex;

        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        }

        return array;
    }

    private async play(interaction: CommandInteraction) {
        await interaction.deferReply({ ephemeral: true });

        const id = interaction.options.getInteger("id", true);

        const quiz = await this.container.prisma.quiz.findFirst({
            where: {
                id,
                OR: {
                    public: true,
                    owner: interaction.user.id
                }
            },
            include: {
                questions: {
                    select: {
                        id: true,
                        answer: true,
                        question: true,
                        answers: true
                    }
                }
            }
        });

        if (!quiz) {
            return interaction.editReply({
                embeds: [
                    new MessageEmbed({
                        color: "RED",
                        title: "Quiz Not Found",
                        description: `Could not find a quiz with the id \`${id}\`.`
                    })
                ]
            });
        }

        if (quiz.random) quiz.questions = this.shuffle(quiz.questions);

        let questionInteraction: CommandInteraction | SelectMenuInteraction = interaction;
        let correct = 0;

        for (const question of quiz.questions) {
            const embed = new MessageEmbed({
                color: "BLUE",
                title: question.question,
                description: question.answers.map((answer, index) => `${index + 1}. \`${answer.answer}\``).join("\n")
            });

            const message = await questionInteraction.editReply({
                embeds: [embed],
                components: [
                    new MessageActionRow({
                        components: [
                            new MessageSelectMenu({
                                options: question.answers.map((answer, index) => ({
                                    label: `${index + 1}. ${answer.answer}`,
                                    value: answer.id.toString()
                                })),
                                customId: "answer",
                                placeholder: "Select an answer"
                            })
                        ]
                    })
                ]
            }) as Message;

            questionInteraction = await message.awaitMessageComponent({ componentType: "SELECT_MENU", filter: interaction => interaction.customId === "answer" });
            if (question.answers.filter(answer => answer.isCorrect).map(answer => answer.id.toString()).includes(questionInteraction.values[0])) correct++;
            await questionInteraction.deferUpdate();
        }

        return questionInteraction.editReply({
            embeds: [
                new MessageEmbed({
                    color: "GREEN",
                    title: "Quiz Completed",
                    description: "You have completed the quiz!",
                    fields: [{
                        name: "Correct",
                        value: `${correct}/${quiz.questions.length}`
                    }]
                })
            ],
            components: []
        });
    }

    private async like(interaction: CommandInteraction) {
        await interaction.deferReply({ ephemeral: true });

        const id = interaction.options.getInteger("id", true);

        const quiz = await this.container.prisma.quiz.findUnique({
            where: { id }
        });

        if (!quiz) {
            return interaction.editReply({
                embeds: [
                    new MessageEmbed({
                        color: "RED",
                        title: "Quiz Not Found",
                        description: `Could not find a quiz with the id \`${id}\`.`
                    })
                ]
            });
        }

        const {quizLike} = this.container.prisma;

        const like = await quizLike.findFirst({
            where: {
                quiz: { id },
                user: interaction.user.id
            }
        });
        const shouldLike = interaction.options.getBoolean("like") ?? !like;

        if (shouldLike && !like) {
            await quizLike.create({
                data: {
                    quiz: { connect: { id } },
                    user: interaction.user.id
                }
            });
        } else if (!shouldLike && like) {
            await quizLike.deleteMany({
                where: {
                    quizId: id,
                    user: interaction.user.id
                }
            });
        }

        return interaction.editReply({
            embeds: [
                new MessageEmbed({
                    color: "GREEN",
                    title: `${shouldLike ? "Liked" : "Disliked"} Quiz`,
                    description: `${shouldLike ? "Liked" : "Disliked"} the quiz with the id \`${id}\`.`
                })
            ]
        });
    }

    private async copy(interaction: CommandInteraction) {
        await interaction.deferReply({ ephemeral: true });

        const id = interaction.options.getInteger("id", true);
        const questions = interaction.options.getBoolean("questions", true);

        const quiz = await this.container.prisma.quiz.findFirst({
            where: {
                id,
                OR: {
                    AND: {
                        public: true,
                        copyable: true
                    },
                    owner: interaction.user.id
                }
            },
            include: { questions: questions ? {
                include: { answers: true }
            } : {
                take: 0
            } }
        });

        if (!quiz) {
            return interaction.editReply({
                embeds: [
                    new MessageEmbed({
                        color: "RED",
                        title: "Quiz Not Found",
                        description: `Could not find a quiz with the id \`${id}\`.`
                    })
                ]
            });
        }

        await interaction.editReply({
            embeds: [
                new MessageEmbed({
                    color: "BLURPLE",
                    title: "Copying Quiz",
                    description: `<a:e:939997251344928848> Copying quiz with the id \`${id}\`.`
                })
            ]
        });

        const createdQuiz = await this.container.prisma.quiz.create({
            data: {
                name: `${quiz.name} (Copy)`,
                description: quiz.description,
                owner: interaction.user.id,
                public: quiz.public,
                copyable: quiz.copyable,
                random: quiz.random,
                thumbnail: quiz.thumbnail
            }
        });

        for (const question of quiz.questions as (QuizQuestion & { answers: QuizAnswer[] })[]) {
            await this.container.prisma.quizQuestion.create({
                data: {
                    quiz: { connect: { id: createdQuiz.id } },
                    question: question.question,
                    answers: {
                        createMany: {
                            data: question.answers.map(answer => ({
                                answer: answer.answer,
                                isCorrect: answer.isCorrect
                            }))
                        }
                    }
                }
            });
        }

        return interaction.editReply({
            embeds: [
                new MessageEmbed({
                    color: "GREEN",
                    title: "Copied Quiz",
                    description: `Copied the quiz with the id \`${id}\`.`
                })
            ]
        });
    }
}