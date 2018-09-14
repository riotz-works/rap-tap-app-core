/**
 * Module declaration for JSON file.
 */
declare module '*.json' {

  /** name element of package.json using Version API. */
  const name: string | undefined;

  /** version element of package.json using Version API. */
  const version: string | undefined;

  /** name dependencies of package.json using Version API. */
  const dependencies: { [name: string]: string } | undefined;

  /** version devDependencies of package.json using Version API. */
  const devDependencies: { [name: string]: string } | undefined;
}
