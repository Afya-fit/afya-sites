/**
 * CSS Modules Type Declaration
 * 
 * Allows TypeScript to understand CSS module imports
 * 
 * @version 1.0 - One-Path Styling Framework
 */

declare module '*.module.css' {
  const classes: Record<string, string>;
  export default classes;
}

declare module '*.module.scss' {
  const classes: Record<string, string>;
  export default classes;
}

declare module '*.module.sass' {
  const classes: Record<string, string>;
  export default classes;
}
