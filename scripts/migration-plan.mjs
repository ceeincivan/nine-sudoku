/**
 * Migration plan for Nine Sudoku database schema
 */
export default [
  {
    name: "001_initial_schema",
    /**
     * @param {any} db
     */
    async up(db) {
      await db.schema
        .createTable("games")
        .ifNotExists()
        .addColumn("id", "text", (/** @type {any} */ col) => col.primaryKey())
        .addColumn("status", "text", (/** @type {any} */ col) => col.notNull())
        .addColumn("puzzle", "text", (/** @type {any} */ col) => col.notNull())
        .addColumn("board", "text", (/** @type {any} */ col) => col.notNull())
        .addColumn("created_at", "timestamp", (/** @type {any} */ col) => col.defaultTo("now()"))
        .execute();
    },
    /**
     * @param {any} db
     */
    async down(db) {
      await db.schema.dropTable("games").ifExists().execute();
    },
  },
];
