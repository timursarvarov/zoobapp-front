const style = `
.page-header, .page-header-space {
    height: 100px;
  }

  .page-footer, .page-footer-space {
    height: 50px;

  }

  .page-footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    border-top: 1px solid black; /* for demo */
    background: yellow; /* for demo */
  }

  .page-header {
    position: fixed;
    top: 0mm;
    width: 100%;
    border-bottom: 1px solid black; /* for demo */
    background: yellow; /* for demo */
  }

  .page {
    page-break-after: always;
  }
  `;
export default style;
