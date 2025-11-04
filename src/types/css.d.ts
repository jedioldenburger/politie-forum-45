declare module "*.css" {
  const content: { readonly [className: string]: string } | string;
  export default content;
}
