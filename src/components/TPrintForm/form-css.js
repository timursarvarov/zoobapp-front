const style = `.print {
    /* //-- header, body, footer -- */
    /* //-- footer -- */
    /* //-- core typography and style -- */
    /* //-- section styles -- */
    /* --// override to force 1/8th width grids -- */
  }
  .print .inner {
    padding: 10px 30px;
    background: #f5f5f5;
    border: solid #666;
    border-width: 8px 0 2px 0;
  }
  .print .inner .hd {
    margin: 2.5em 0 3em 0;
    padding-bottom: 1.5em;
    border-bottom: 1px solid #ccc;
  }
  .print .inner .hd .hd-wrapper {
    display: flex;
    justify-content: space-between;
  }
  .print .inner .hd h3 {
    letter-spacing: 2px;
  }
  .print .yui-gf {
    display: flex;
    justify-content: space-between;
    margin-bottom: 2em;
    padding-bottom: 2em;
    border-bottom: 1px solid #ccc;
  }
  .print .bd, .print #ft {
    margin-bottom: 2em;
  }
  .print #ft {
    padding: 1em 0 5em 0;
    border-top: 1px solid #ccc;
    text-align: center;
  }
  .print #ft p {
    margin-bottom: 0;
    text-align: center;
  }
  .print #hd h1 {
    text-transform: uppercase;
    letter-spacing: 3px;
  }
  .print h1, .print h2, .print h3, .print h4 {
    color: #333;
  }
  .print p {
    line-height: 18px;
    padding-right: 3em;
  }
  .print a {
    color: #990003;
  }
  .print a:hover {
    text-decoration: none;
  }
  .print strong {
    font-weight: bold;
  }
  .print li {
    line-height: 24px;
    border-bottom: 1px solid #ccc;
  }
  .print p.enlarge {
    padding-right: 6.5em;
    line-height: 24px;
  }
  .print p.enlarge span {
    color: #000;
  }
  .print .contact-info {
    margin-top: 7px;
  }
  .print .first h2 {
    font-style: italic;
  }
  .print .last {
    border-bottom: 0;
  }
  .print a.pdf {
    display: block;
    float: left;
    background: #666;
    color: white;
    padding: 6px 50px 6px 12px;
    margin-bottom: 6px;
    text-decoration: none;
  }
  .print a.pdf:hover {
    background: #222;
  }
  .print .job {
    position: relative;
    margin-bottom: 1em;
    padding-bottom: 1em;
    border-bottom: 1px solid #ccc;
  }
  .print .job h4 {
    position: absolute;
    top: 0.35em;
    right: 0;
  }
  .print .job p {
    margin: 0.75em 0 3em 0;
  }
  .print .last {
    border: none;
  }
  .print .skills-list ul {
    margin: 0;
  }
  .print .skills-list li {
    margin: 3px 0;
    padding: 3px 0;
  }
  .print .skills-list li span {
    display: block;
    margin-bottom: -2px;
    padding: 0;
  }
  .print .talent {
    width: 32%;
    float: left;
  }
  .print .talent h2 {
    margin-bottom: 6px;
  }
  .print .srt-ttab {
    margin-bottom: 100px;
    text-align: center;
  }
  .print .srt-ttab img.last {
    margin-top: 20px;
  }
  .print .yui-gf .yui-u {
    width: 80.2%;
  }
  .print .yui-gf div.first {
    width: 12.3%;
  }
  `;
export default style;
