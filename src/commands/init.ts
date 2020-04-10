import { Command, flags } from "@oclif/command";
import cli from "cli-ux";
// @ts-ignore
import * as exec from "shelljs.exec";
// @ts-ignore
import * as degit from "degit";

const boxen = require("boxen");
const chalk = require("chalk");
export default class Init extends Command {
  static description = "create a tez blank project";

  static examples = [`$ tez-cli init [PROJECT_NAME]`];

  static templatePath = `${__dirname}/../../template`;
  static flags = {
    help: flags.help({ char: "h" }),
  };

  static args = [{ name: "project_name" }];

  notifyMsg(name: string) {
    let installCommand;

    installCommand = `cd ${name}  && npm start \n\n API Server  http://127.0.0.1:3000/ \n\n API Docs http://127.0.0.1:3000/docs`;

    const defaultTemplate = " \nRun " + chalk.greenBright(`${installCommand}`);

    const boxenOptions = {
      padding: 1,
      margin: 1,
      align: "center",
      borderColor: "yellow",
      borderStyle: "round",
    };

    const message = "\n" + boxen(defaultTemplate, boxenOptions);

    process.on("exit", () => {
      console.error(message);
    });

    process.on("SIGINT", () => {
      console.error("");
      process.exit();
    });
  }

  async run() {
    const { argv } = this.parse(Init);
    const projectName = argv[0];
    const projectPath = projectName ? `./${projectName}` : "./";
    cli.action.start(`creating project "${projectName}"`);

    const emitter = degit("riazXrazor/tez", {
      cache: false,
      force: true,
      verbose: false,
    });

    try {
      await emitter.clone(projectPath);
      cli.action.stop();

      cli.action.start(`installing dependencies`);
      exec(`cd ${projectPath} && npm install`);
      cli.action.stop();

      cli.action.start(`Finishing setup`);
      exec(`cd ${projectPath} && npm run gen:env`);
      exec(`cd ${projectPath} && npm run gen:key`);
      cli.action.stop();
      this.notifyMsg(projectName);
    } catch (e) {
      this.log(e);
    }
  }
}
