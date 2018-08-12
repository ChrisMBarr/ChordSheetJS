import chai, { expect } from 'chai';

import '../matchers';
import HtmlTableFormatter from '../../src/formatter/html_table_formatter';
import htmlEntitiesEncode from '../../src/formatter/html_entities_encode';
import song from '../fixtures/song';
import { createChordLyricsPair, createLine, createSong } from '../utilities';

chai.use(require('chai-diff'));

describe('HtmlTableFormatter', () => {
  it('formats a song to a html chord sheet correctly', () => {
    const formatter = new HtmlTableFormatter();

    const expectedChordSheet =
      '<h1>Let it be</h1>' +
      '<h2>ChordSheetJS example version</h2>' +
      '<div class="chord-sheet">' +
        '<table class="row">' +
          '<tr>' +
            '<td class="comment">Bridge</td>' +
          '</tr>' +
        '</table>' +
        '<table class="row empty-line"></table>' +
        '<table class="row">' +
          '<tr>' +
            '<td class="chord"></td>' +
            '<td class="chord">Am</td>' +
            '<td class="chord">C/G</td>' +
            '<td class="chord">F</td>' +
            '<td class="chord">C</td>' +
          '</tr>' +
          '<tr>' +
            '<td class="lyrics">Let it </td>' +
            '<td class="lyrics">be, let it </td>' +
            '<td class="lyrics">be, let it </td>' +
            '<td class="lyrics">be, let it </td>' +
            '<td class="lyrics">be</td>' +
          '</tr>' +
        '</table>' +
        '<table class="row">' +
          '<tr>' +
            '<td class="chord">C</td>' +
            '<td class="chord">F</td>' +
            '<td class="chord">G</td>' +
            '<td class="chord">F</td>' +
            '<td class="chord">C/E</td>' +
            '<td class="chord">Dm</td>' +
            '<td class="chord">C</td>' +
          '</tr>' +
          '<tr>' +
            '<td class="lyrics">Whisper words of </td>' +
            '<td class="lyrics">wis</td>' +
            '<td class="lyrics">dom, let it </td>' +
            '<td class="lyrics">be </td>' +
            '<td class="lyrics"> </td>' +
            '<td class="lyrics"> </td>' +
            '<td class="lyrics"> </td>' +
          '</tr>' +
        '</table>' +
        '<table class="row empty-line"></table>' +
        '<table class="row">' +
          '<tr>' +
            '<td class="chord">Am</td>' +
            '<td class="chord">Bb</td>' +
            '<td class="chord">F</td>' +
            '<td class="chord">C</td>' +
          '</tr>' +
          '<tr>' +
            '<td class="lyrics">Whisper words of </td>' +
            '<td class="lyrics">wisdom, let it </td>' +
            '<td class="lyrics">be </td>' +
            '<td class="lyrics"></td>' +
          '</tr>' +
        '</table>' +
      '</div>';

    expect(formatter.format(song)).to.equalText(expectedChordSheet);
  });

  it('encodes HTML entities', () => {
    const formatter = new HtmlTableFormatter();

    const songWithHtmlEntities = createSong([
      createLine([
        createChordLyricsPair('Am', '<h1>Let it</h1>'),
      ]),
    ]);

    const expectedChordSheet =
      '<div class="chord-sheet">' +
        '<table class="row">' +
          '<tr>' +
            '<td class="chord">Am</td>' +
          '</tr>' +
          '<tr>' +
            `<td class="lyrics">${htmlEntitiesEncode('<h1>Let it</h1>')}</td>` +
          '</tr>' +
        '</table>' +
      '</div>';

    expect(formatter.format(songWithHtmlEntities)).to.equalText(expectedChordSheet);
  });

  context('with option renderBlankLines:false', () => {
    it('does not include HTML for blank lines', () => {
      const songWithBlankLine = createSong([
        createLine([
          createChordLyricsPair('C', 'Whisper words of wisdom'),
        ]),

        createLine([]),

        createLine([
          createChordLyricsPair('Am', 'Whisper words of wisdom'),
        ]),
      ]);

      const expectedChordSheet =
        '<div class="chord-sheet">' +
          '<table class="row">' +
            '<tr>' +
              '<td class="chord">C</td>' +
            '</tr>' +
            '<tr>' +
              '<td class="lyrics">Whisper words of wisdom</td>' +
            '</tr>' +
          '</table>' +
          '<table class="row">' +
            '<tr>' +
              '<td class="chord">Am</td>' +
            '</tr>' +
            '<tr>' +
              '<td class="lyrics">Whisper words of wisdom</td>' +
            '</tr>' +
          '</table>' +
        '</div>';

      const formatter = new HtmlTableFormatter({ renderBlankLines: false });

      expect(formatter.format(songWithBlankLine)).to.equalText(expectedChordSheet);
    });
  });
});
