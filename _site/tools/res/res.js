/* res v0.1
 * Copyright (c) 2020 Eugene Y. Q. Shen.
 *
 * res is free software: you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation, either version
 * 3 of the License, or (at your option) any later version.
 *
 * res is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty
 * of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see http://www.gnu.org/licenses/.
 */


const TERMS = new Set("abcdefxyzuvw".split(''))
const SUPPORT_TO_PREMISES = {
  P1:  ["WeakPref(x,y) | WeakPref(y,x)"],
  P2:  ["~WeakPref(x,y) | ~WeakPref(y,z) | WeakPref(x,z)"],
  P3:  ["~StrongPref(x,y) | ~WeakPref(y,x)",
        "WeakPref(y,x) | StrongPref(x,y)"],
  P4:  ["~Indiff(x,y) | WeakPref(y,x)",
        "~Indiff(x,y) | WeakPref(x,y)",
        "~WeakPref(y,x) | ~WeakPref(x,y) | Indiff(x,y)"],
  P5:  ["~StrongPref(x,y) | ~StrongPref(y,x)"],
  P6:  ["~StrongPref(x,y) | ~StrongPref(y,z) | StrongPref(x,z)"],
  P7:  ["Indiff(x,x)"],
  P8:  ["~Indiff(x,y) | Indiff(y,x)"],
  P9:  ["~StrongPref(x,y) | ~Indiff(y,z) | StrongPref(x,z)"],
  P10: ["StrongPref(x,y) | Indiff(x,y) | StrongPref(y,x)"],
  P11: ["~WeakPref(x,y) | StrongPref(x,y) | Indiff(x,y)",
        "~StrongPref(x,y) | WeakPref(x,y)",
        "~Indiff(x,y) | WeakPref(x,y)"],
  C1:  ["~WeakPref(a,a)"],
  C2:  ["~Indiff(a,a)"],
  C3:  ["Indiff(a,b) | Indiff(b,a)",
        "Indiff(a,b) | ~Indiff(a,b)",
        "~Indiff(b,a) | Indiff(b,a)",
        "~Indiff(b,a) | ~Indiff(a,b)"],
  C4:  ["Indiff(a,b)",
        "Indiff(b,c)",
        "~Indiff(a,c)"],
  C5:  ["StrongPref(a,b)",
        "~WeakPref(a,b)"],
  C6:  ["StrongPref(a,b)",
        "StrongPref(b,a)"],
  C7:  ["StrongPref(a,b)",
        "StrongPref(b,c)",
        "~StrongPref(a,c)"],
  C8:  ["Indiff(a,b)",
        "StrongPref(b,a) | StrongPref(a,b)"],
  C9:  ["Indiff(a,b)",
        "StrongPref(b,c)",
        "~StrongPref(a,c)"],
  C10: ["Indiff(a,b)",
        "StrongPref(c,a)",
        "~StrongPref(c,b)"],
  C11: ["StrongPref(a,b)",
        "WeakPref(b,c)",
        "~StrongPref(a,c)"],
  C12: ["~WeakPref(a,b)",
        "~StrongPref(b,a)"],
  C13: ["StrongPref(a,b)",
        "Indiff(a,b)"],
  C14: ["StrongPref(a,b) | Indiff(a,b)",
        "~WeakPref(a,b)"],
  C15: ["WeakPref(a,b)",
        "~StrongPref(a,b)",
        "~Indiff(a,b)"],
}


function translateLine(line) {
  return line
      .replace(/&/g, '∧')
      .replace(/\|/g, '∨')
      .replace(/~/g, '¬')
      .replace(/\$/g, '→')
      .replace(/%/g, '↔')
      .replace(/\^/g, '⊥')
      .replace(/@/g, '∀')
      .replace(/\//g, '∃')
      .replace(/#/g, '≠')
      .replace(/\\\\/g, '∈')
      .replace(/_/g, '⊆')
      .replace(/\*/g, '×');
}


function parseProof(s) {
  function parseRec(m, n) {
    if (s.length >= 2 && s.slice(m, m + 2) == "t=") {
      return [{t: s.slice(m, n)}];
    }
    const res = [];
    for (let i = m; i < n; ++i) {
      if (s[i] == '{' || s[i] == '(') {
        for (let count = 0, j = i; j < n; ++j) {
          if (s[j] == '{' || s[j] == '(') {
            ++count;
          } else if (s[j] == '}' || s[j] == ')') {
            --count;
            if (count == 0) {
              res.push({t: s.slice(m, i), c: parseRec(i + 1, j)});
              if (s.length > j + 1 && s[j + 1] == ',') {
                j += 1;
              }
              i = j;
              m = i + 1;
              break;
            }
          }
        }
      } else if (s[i] == ';') {
        res.push({t: s.slice(m, i + 1)});
        m = i + 1;
      }
    }
    return res;
  }
  return parseRec(0, s.length);
}


function printRec(s, indent) {
  let res = "";
  for (let i = 0; i < indent; ++i) {
    res += "  ";
  }
  for (let r of s) {
    console.log(res + r.t);
    if (r.c) {
      printRec(r.c, indent + 1);
    }
  }
}


function parseComment(comment, step_type) {
  const s = comment;
  if (s.length < 5) {
    throw `Comment is too short: ${s}`;
  }

  const res = {rule: null, lines: null};
  if (step_type == "Premise" && s.split(':')[0].trim() == "SM") {
    res.rule = "SM";
  } else if (step_type == "Step" && s.split(':')[0].trim() == "SUB") {
    res.rule = "SUB";
  } else if (step_type == "Step" && s.split(':')[0].trim() == "RES") {
    res.rule = "RES";
  } else {
    throw `Comment does not use a valid rule: ${s}`;
  }

  if (step_type == "Premise") {
    res.lines = [s.split(':', 2)[1].split(' ')[0].split(',')[0].toUpperCase()];
  } else {
    res.lines = s.split(':', 2)[1].split(',').map(l => parseInt(l, 10)).sort();
  }
  return res;
}


function parseStep(step, index) {
  index += 1;
  const step_type = (step.c[1].t == "r=openproof.stepdriver.SRPremiseRule") ?
      "Premise" : "Step";
  const support = (step_type == "Step" && step.c[3].c[0].c.length > 0) ?
    step.c[3].c[0].c.map(
      l => parseInt(l.c[0].t.split('=').pop().slice(0, -1)) + 1
    ).sort() : [];

  const s = step.c[0].c[0].c[0].c[0].t;
  if (s.length < 3) {
    throw `${step_type} ${index} is too short: ${s}`;
  } else if (s.slice(0, 2) != "t=") {
    throw `${step_type} ${index} does not begin with "t=": ${s}`;
  } else if (s.indexOf('"') == -1) {
    throw `${step_type} ${index} does not have any comments: ${s}`;
  } else {
    const full = s.slice(3, -2);
    const sentence = full.split(';', 2)[0].trim();
    const comment = full.split(';', 2)[1].trim();
    const {rule, lines} = parseComment(comment.trim(), step_type);
    return {step_type, index, full, sentence, comment, rule, lines, support};
  }
}


function generateAtom(atom) {
  return `${atom.predicate}(${atom.terms.join(',')})`;
}


function parseAtom(atom_text) {
  atom_text = atom_text.trim();
  const open_paren_index = atom_text.indexOf('(');
  if (open_paren_index == -1 || atom_text.indexOf(')') == -1) {
    throw `Atom does not have any predicates: ${atom_text}`;
  }

  const predicate = atom_text.slice(0, open_paren_index);
  const terms = atom_text.slice(open_paren_index + 1, atom_text.indexOf(')'))
      .split(',').map(term => term.trim());
  return {atom: generateAtom({predicate, terms}), predicate, terms};
}


function parseLiteral(literal_text) {
  literal_text = literal_text.trim()
  if (literal_text[0] == '~') {
    return {sign: "neg", ...parseAtom(literal_text.slice(1))};
  } else {
    return {sign: "pos", ...parseAtom(literal_text)};
  }
}


function parseClause(clause_text) {
  clause_text = clause_text.trim()
  const res = {signs: {}, terms: {}};
  if (clause_text == '^') {
    return res;
  }

  for (const literal of clause_text.split('|').map(parseLiteral)) {
    res.terms[literal.atom] = {
      predicate: literal.predicate, terms: literal.terms,
    };
    if (res.signs.hasOwnProperty(literal.atom)) {
      if (res.signs[literal.atom] != literal.sign) {
        res.signs[literal.atom] = "both";
      }
    } else {
      res.signs[literal.atom] = literal.sign;
    }
  }
  return res;
}


function verifyPremise(support, res) {
  const expected = parseClause(res).signs;
  if (SUPPORT_TO_PREMISES.hasOwnProperty(support)) {
    for (const premise of SUPPORT_TO_PREMISES[support]) {
      const clause = parseClause(premise).signs;
      if (JSON.stringify(clause, Object.keys(clause).sort()) ==
        JSON.stringify(expected, Object.keys(expected).sort())) {
        return "pass";
      }
    }
  }
  return "fail";
}


function verifyRes(support1, support2, res) {
  const merged = parseClause(support1).signs;
  const unmerged = parseClause(support2).signs;
  const expected = parseClause(res).signs;

  let clash = false;
  for (const atom in unmerged) {
    if (unmerged.hasOwnProperty(atom)) {
      if (merged.hasOwnProperty(atom)) {
        if (merged[atom] == "both" && unmerged[atom] == "both") {
          return false;
        } else if (merged[atom] != unmerged[atom]) {
          if (clash) {
            return false;
          }

          clash = true;
          if (merged[atom] == "both") {
            merged[atom] = (unmerged[atom] == "pos") ?  "neg" : "pos";
          } else if (unmerged[atom] == "both") {
            merged[atom] = (merged[atom] == "pos") ?  "neg" : "pos";
          } else {
            delete merged[atom];
          }
        }
      } else {
        merged[atom] = unmerged[atom];
      }
    }
  }

  if (clash) {
    return JSON.stringify(merged, Object.keys(merged).sort()) ==
        JSON.stringify(expected, Object.keys(expected).sort());
  } else {
    return false;
  }
}


function verifySub(support, res) {
  const original = parseClause(support).terms;
  const expected = parseClause(res).terms;

  for (const old_term of TERMS) {
    for (const new_term of TERMS) {
      if (new_term != old_term) {
        const subbed = JSON.parse(JSON.stringify(original));
        for (const atom in original) {
          if (original.hasOwnProperty(atom)) {
            let changed = false;
            for (let i = 0; i < original[atom].terms.length; ++i) {
              if (original[atom].terms[i] == old_term) {
                subbed[atom].terms[i] = new_term;
                changed = true;
              }
            }

            if (changed) {
              subbed[generateAtom(subbed[atom])] = true;
              delete subbed[atom];
            }
          }
        }
        if (JSON.stringify(Object.keys(subbed).sort()) ==
            JSON.stringify(Object.keys(expected).sort())) {
          return true;
        }
      }
    }
  }
  return false;
}


function createLabel(label_text, value_text) {
  const label = document.createElement("p");
  label.appendChild(document.createTextNode(label_text));
  const value = document.createElement("pre");
  value.appendChild(document.createTextNode(value_text));

  const res = document.createElement("label");
  res.appendChild(label);
  res.appendChild(value);
  return res;
}


function renderStep(step_info) {
  const heading = document.createElement("h3");
  heading.appendChild(document.createTextNode(
    `${step_info.step_type} ${step_info.index}`
  ));

  const rule_div = document.createElement("div");
  rule_div.classList.add("rule");
  rule_div.appendChild(createLabel("Rule:", step_info.rule));
  rule_div.appendChild(createLabel("Comment Lines:", step_info.lines));
  rule_div.appendChild(createLabel("FITCH Support Lines:", step_info.support));

  const step_div = document.createElement("div");
  step_div.appendChild(heading);
  step_div.appendChild(createLabel("Original line:", step_info.full));
  step_div.appendChild(
      createLabel("Sentence:", translateLine(step_info.sentence)));
  step_div.appendChild(rule_div);
  document.getElementById("main").appendChild(step_div);
}


function startApp(raw_proof) {
  const main_div = document.getElementById("main");
  while (main_div.firstChild) {
    main_div.firstChild.remove();
  }

  const proof = parseProof(raw_proof[5]);
  const steps = proof[0].c[0].c[0].c[5].c;
  const info = steps.map(parseStep);
  info.forEach(renderStep);

  const main = document.getElementById("main");
  for (let i = 0; i < steps.length; ++i) {
    const verify_div = document.createElement("div");
    if (info[i].rule == "SM") {
      verify_div.classList.add(verifyPremise(
          info[i].lines[0], info[i].sentence,
      ));
    } else if (info[i].rule == "RES") {
      verify_div.classList.add(verifyRes(
          info[info[i].lines[0] - 1].sentence,
          info[info[i].lines[1] - 1].sentence,
          info[i].sentence,
      ) ? "pass" : "fail");
    } else if (info[i].rule == "SUB") {
      verify_div.classList.add(verifySub(
          info[info[i].lines[0] - 1].sentence, info[i].sentence,
      ) ? "pass" : "fail");
    } else {
      throw `Step does not use a valid rule: ${info[i]}`;
    }
    main.children[i].appendChild(verify_div);
  }

  if (proof[0].c[0].c[1].c[0].c.length > 0) {
    const s = proof[0].c[0].c[1].c[0].c[0].c[0].c[0].c[0].t;
    const goal = s.slice(0, s.lastIndexOf(';', s.lastIndexOf(';') - 1));
    const heading = document.createElement("h3");
    heading.appendChild(
        document.createTextNode(`Goal: ${translateLine(goal.slice(3, -1))}`)
    );

    const goal_div = document.createElement("div");
    goal_div.appendChild(heading);
    document.getElementById("main").appendChild(goal_div);
  }
}


document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("upload").addEventListener("submit", function (e) {
    e.preventDefault();
    const reader = new FileReader();
    reader.onload = (e) => startApp(e.target.result.split('\r'));
    reader.readAsText(e.target.elements.file.files[0]);
  });
});
