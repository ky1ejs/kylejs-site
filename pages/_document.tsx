/**
 * This file extends the <Document /> and injects the server side rendered styles into the <head>
 * By server-side rendering CSS we avoid visual changes in the layout while loading the JS.
 *
 * Taken from this example:
 * https://github.com/zeit/next.js/tree/master/examples/with-styled-components
 */

import React from "react";
import Document from "next/document";
import { Html, Main, Head, NextScript } from "next/document";

/* eslint-disable import/no-anonymous-default-export */
export default class extends Document {
  render() {
    return (
      <Html lang="en">
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
