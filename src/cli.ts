import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { formatPlanReportMarkdown, generateDeploymentPlan } from "./planner.js";
import type { CloudProvider, InputVars } from "./types.js";

interface CliArgs {
  provider: CloudProvider;
  varsFile: string;
  outFile?: string;
  format: "json" | "markdown";
}

function parseArgs(argv: string[]): CliArgs {
  const flags = new Map<string, string>();

  for (let i = 2; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith("--")) {
      continue;
    }

    const key = token.slice(2);
    const value = argv[i + 1];
    if (!value || value.startsWith("--")) {
      throw new Error(`Flag --${key} requires a value`);
    }

    flags.set(key, value);
    i += 1;
  }

  const providerRaw = flags.get("provider");
  if (providerRaw !== "aws" && providerRaw !== "azure" && providerRaw !== "gcp") {
    throw new Error("--provider must be one of aws|azure|gcp");
  }

  const varsFile = flags.get("vars-file");
  if (!varsFile) {
    throw new Error("--vars-file is required");
  }

  const formatRaw = flags.get("format") ?? "json";
  if (formatRaw !== "json" && formatRaw !== "markdown") {
    throw new Error("--format must be json or markdown");
  }

  return {
    provider: providerRaw,
    varsFile,
    outFile: flags.get("out"),
    format: formatRaw
  };
}

async function loadVars(varsFile: string): Promise<InputVars> {
  const payload = await readFile(varsFile, "utf8");
  const parsed = JSON.parse(payload) as unknown;

  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("vars-file must contain a JSON object");
  }

  return parsed as InputVars;
}

async function run(): Promise<void> {
  const args = parseArgs(process.argv);
  const vars = await loadVars(path.resolve(process.cwd(), args.varsFile));
  const plan = generateDeploymentPlan(args.provider, vars);

  if (args.format === "markdown") {
    const report = formatPlanReportMarkdown(plan);
    if (args.outFile) {
      await writeFile(path.resolve(process.cwd(), args.outFile), report, "utf8");
    } else {
      process.stdout.write(report);
    }
  } else {
    const report = `${JSON.stringify(plan, null, 2)}\n`;
    if (args.outFile) {
      await writeFile(path.resolve(process.cwd(), args.outFile), report, "utf8");
    } else {
      process.stdout.write(report);
    }
  }

  if (!plan.valid) {
    process.exitCode = 1;
  }
}

run().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exit(2);
});
