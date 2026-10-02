// Execute the production SQL against SQLite; batch has D1 transaction semantics.
import { DatabaseSync } from "node:sqlite";
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";

class Statement {
  constructor(database, sql) { this.statement = database.prepare(sql); this.args = []; }
  bind(...args) { this.args = args; return this; }
  async first() { return this.statement.get(...this.args) ?? null; }
  async all() { return { results: this.statement.all(...this.args) }; }
  execute() {
    const result = this.statement.run(...this.args);
    return { success: true, meta: { changes: Number(result.changes) } };
  }
  async run() { return this.execute(); }
}

export function createTestDatabase(root, beforeAccountMigration = () => {}) {
  const sqlite = new DatabaseSync(":memory:");
  sqlite.exec("PRAGMA foreign_keys = ON");
  for (const migration of readdirSync(path.join(root, "migrations")).filter((name) => name.endsWith(".sql")).sort()) {
    if (migration.startsWith("0002")) beforeAccountMigration(sqlite);
    sqlite.exec(readFileSync(path.join(root, "migrations", migration), "utf8"));
  }
  return {
    sqlite,
    prepare: (sql) => new Statement(sqlite, sql),
    async batch(statements) {
      sqlite.exec("BEGIN");
      try {
        const result = statements.map((statement) => statement.execute());
        sqlite.exec("COMMIT");
        return result;
      } catch (error) { sqlite.exec("ROLLBACK"); throw error; }
    },
  };
}
