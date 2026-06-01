import type { Answers } from '@/lib/types';
import { getSymbolByValue } from '@/data/symbols';

const ELEMENT_MOTIF: Record<string, string> = {
  fire: 'curling engraved flames',
  water: 'engraved flowing waves',
  earth: 'engraved oak leaves and acorns',
  air: 'engraved feathers and stars',
};

function firstClause(s: string | undefined): string {
  if (!s) return '';
  return s.split(/[,.]|\bbecause\b|\bwhich\b|\bthat\b|\band\b/i)[0].trim();
}

function familyInitial(answers: Answers): string {
  const f = (answers.familyname || answers.firstname || '').trim();
  return f ? f.charAt(0).toUpperCase() : '';
}

export function buildPrompt(answers: Answers): string {
  const animal = firstClause(answers.animal) || 'a single emblematic creature';
  const symbolEntry = answers.symbol ? getSymbolByValue(answers.symbol) : undefined;
  const symbolPart = symbolEntry
    ? `, with ${symbolEntry.promptDescription}`
    : answers.symbol
    ? `, with small engraved ${answers.symbol}`
    : '';
  const plantPart = answers.plant ? `, framed by ${firstClause(answers.plant)}` : '';
  const elementPart = answers.element ? `, surrounded by ${ELEMENT_MOTIF[answers.element]}` : '';
  const initial = answers.includeInitial === 'no' ? '' : familyInitial(answers);
  const monogramPart = initial ? `, and the serif initial "${initial}" engraved beneath` : '';

  const crest = `a heraldic ${animal} carved at the centre${plantPart}${elementPart}${symbolPart}${monogramPart}`;

  return `Hyper-detailed macro product photograph of a luxurious antique solid gold signet ring resting on soft ivory linen, photographed from directly above in warm soft natural studio light. The wide round polished gold face is DEEPLY ENGRAVED and ETCHED INTO THE GOLD (intaglio relief, hand-chased) with a personal crest: ${crest}. The engraving is cut into warm 18k yellow gold — recessed grooves and raised relief catching golden light, fine tool marks, gentle antique patina settling in the lines. Solid warm yellow gold metal, satin finish with hand-polished highlights, substantial rounded band. Soft ivory and cream background. Photorealistic fine-jewelry editorial photography, 8k, razor sharp, shallow depth of field, soft natural shadow beneath the ring. It is unmistakably a real engraved gold signet ring — NOT abstract art, NOT a flat 2D drawing, NOT a black object, NO dark background, only warm polished gold.`;
}
