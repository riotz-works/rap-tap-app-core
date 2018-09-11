/**
 * Module declaration for JSON file.
 */
declare module '*.json' {

  /** name element of package.json using Version API. */
  const name: string | undefined;

  /** version element of package.json using Version API. */
  const version: string | undefined;
}
