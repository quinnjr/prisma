import { Command, arg, format, Env, HelpError, CompiledGeneratorDefinition } from '@prisma/cli'
import chalk from 'chalk'
import { Lift } from '../../Lift'

/**
 * $ prisma migrate new
 */
export class LiftWatch implements Command {
  static new(env: Env, generators: CompiledGeneratorDefinition[]): LiftWatch {
    return new LiftWatch(env, generators)
  }
  private constructor(private readonly env: Env, private readonly generators: CompiledGeneratorDefinition[]) {}

  // parse arguments
  async parse(argv: string[]): Promise<string | Error> {
    const args = arg(argv, {
      '--preview': Boolean,
      '-p': '--preview',
    })
    const preview = args['--preview'] || false

    const lift = new Lift(this.env.cwd)
    return lift.watch({
      preview,
      generators: this.generators,
    })
  }

  // help message
  help(error?: string): string | HelpError {
    if (error) {
      return new HelpError(`\n${chalk.bold.red(`!`)} ${error}\n${LiftWatch.help}`)
    }
    return LiftWatch.help
  }

  // static help template
  private static help = format(`
    Watch local changes and migrate automatically

    ${chalk.bold('Usage')}

      prisma dev
  `)
}
