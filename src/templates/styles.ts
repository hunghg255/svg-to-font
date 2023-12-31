export const stylesTemplate = ({ fontname, timestamp, cssString, prefix, fontSize }: any) => {
  return `
@font-face {
  font-family: "${fontname}";
  src: url('${fontname}.eot?t=${timestamp}'); /* IE9*/
  src: url('${fontname}.eot?t=${timestamp}#iefix') format('embedded-opentype'), /* IE6-IE8 */
  url("${fontname}.woff2?t=${timestamp}") format("woff2"),
  url("${fontname}.woff?t=${timestamp}") format("woff"),
  url('${fontname}.ttf?t=${timestamp}') format('truetype'), /* chrome, firefox, opera, Safari, Android, iOS 4.2+*/
  url('${fontname}.svg?t=${timestamp}#${fontname}') format('svg'); /* iOS 4.1- */
}

[class^="${prefix}-"], [class*=" ${prefix}-"] {
  font-family: '${fontname}' !important;
  font-size:${fontSize};
  font-style:normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

${cssString}
  `;
};
