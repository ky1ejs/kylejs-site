/**
 * This file extends the <Document /> and injects the server side rendered styles into the <head>
 * By server-side rendering CSS we avoid visual changes in the layout while loading the JS.
 *
 * Taken from this example:
 * https://github.com/zeit/next.js/tree/master/examples/with-styled-components
 */

import React from "react";
import Document, { DocumentContext, DocumentInitialProps } from "next/document";
import { ServerStyleSheet } from "styled-components";
import { Html, Main, Head, NextScript } from "next/document";

/* eslint-disable import/no-anonymous-default-export */
export default class extends Document {
  static async getInitialProps(
    ctx: DocumentContext
  ): Promise<DocumentInitialProps> {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          /* eslint-disable @typescript-eslint/no-explicit-any */
          enhanceApp: (App: any) => (props) =>
            /* eslint-enable @typescript-eslint/no-explicit-any */
            sheet.collectStyles(<App {...props} />),
        });

      const initialProps = await Document.getInitialProps(ctx);
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      };
    } finally {
      sheet.seal();
    }
  }

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
