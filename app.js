'use strict';
const lessons = [
  {
    title: 'Enter the practice ground', tag: '01 / Session',
    intro: 'A terminal window is a client. Herdr’s background server owns the processes. Closing the window and killing the server are very different things.',
    goal: 'Open an isolated practice session beside this website. Leave your actual work alone.',
    steps: ['Use a NEW terminal window outside Herdr. Run the check below; if it prints 1, you are inside Herdr—open an ordinary terminal instead. Do not detach your working session just for this course.', 'Run the launch commands in that outer terminal. Complete any first-run prompts. If herdr-school is already one of your real sessions, choose another unused name and use it throughout the course.', 'You should land in a real shell inside Herdr. The browser is your coach, not your terminal.'],
    commands: [ ['Outer terminal · check first', 'printenv HERDR_ENV'], ['Outer terminal · only if the check did not print 1', 'mkdir -p "$HOME/herdr-practice"\ncd "$HOME/herdr-practice"\nherdr --session herdr-school'] ],
    observe: 'A Herdr interface with a shell pane. The school session has separate pane/process state from your normal session; your filesystem and Herdr config are still shared.',
    recovery: 'If nested launch is blocked, return to a fresh ordinary terminal. If herdr is not found, follow the official installation docs, then run herdr --version. This course uses 0.9.0. No installation or configuration changes are needed on the machine where this guide was built.',
    question: 'What does the named school session isolate?',
    choices: ['Your entire filesystem and all configuration', 'Herdr runtime state and pane processes', 'Only the colour of the sidebar'], answer: 1,
    why: 'A named session is a separate server namespace. It is not a filesystem sandbox.'
  },
  {
    title: 'Give the project a home', tag: '02 / Workspace',
    intro: 'One workspace should mean one project, task, or investigation—not one terminal.',
    goal: 'Find your school workspace and rename it Fieldwork.',
    steps: ['Look at the workspace in the sidebar. Try its right-click menu to find the rename action. Rename this practice workspace Fieldwork.', 'If you prefer a precise terminal command, run the rename command below from a SHELL pane in the school session. The environment variable targets your own workspace, not whichever workspace another client happens to focus.', 'Think of a real project you would give its own workspace. Keep that separate from today’s disposable practice.'],
    commands: [['Inside the school shell · alternative to the mouse', 'herdr workspace rename "$HERDR_WORKSPACE_ID" Fieldwork']],
    observe: 'Fieldwork in the sidebar. It will hold multiple tabs and panes for one task.',
    recovery: 'If the sidebar is hidden, use Ctrl+b, release, then b. If you have changed bindings, open Herdr’s Help through its menu. Don’t rename a workspace from your normal work session.',
    question: 'Where should you group several terminal layouts for one project?',
    choices: ['In a workspace', 'In a single terminal process', 'In a separate Herdr installation'], answer: 0,
    why: 'The workspace is the project-level container; tabs are layouts inside it.'
  },
  {
    title: 'Separate your views', tag: '03 / Tab',
    intro: 'Tabs separate contexts within a project: build, logs, agents. They don’t need separate servers.',
    goal: 'Create a second tab called Bench and switch between it and your original tab.',
    steps: ['Use Herdr’s clickable UI or right-click menus to create a tab. Name it Bench if prompted; otherwise use its rename action.', 'Click the original tab, then Bench. Notice that the original shell is still there.', 'The command below is an ALTERNATIVE to creating it with the mouse—don’t do both unless you want another tab.'],
    commands: [['Inside the school shell · alternative tab creation', 'herdr tab create --workspace "$HERDR_WORKSPACE_ID" --cwd "$PWD" --label Bench --focus']],
    observe: 'Two tabs in Fieldwork. Changing tabs changes the layout you see; it does not terminate the hidden shell.',
    recovery: 'If you accidentally made extra tabs, leave them for now. Don’t close a tab with an agent or important process in it. Use the live Help screen to find your new-tab binding.',
    question: 'Does switching away from a tab stop its processes?',
    choices: ['Yes, unless its pane is zoomed', 'Yes, tabs are only saved screenshots', 'No, the server keeps them running'], answer: 2,
    why: 'Visibility and process lifetime are independent.'
  },
  {
    title: 'Make room for two jobs', tag: '04 / Pane',
    intro: 'A pane is a real terminal. The shell on the right is not a second view of the shell on the left.',
    goal: 'Split Bench into two panes, put a different marker in each, then resize the divider.',
    steps: ['Use the pane’s right-click menu to split right. Click the left pane and run the first marker command below.', 'Click the right pane and run the second marker command. Click between them; observe which prompt receives input.', 'Drag the divider to resize the panes. You have now learned the mouse route before memorising shortcuts.'],
    commands: [['Left school pane', 'printf "LEFT: editor territory\\n"'], ['Right school pane', 'printf "RIGHT: test territory\\n"']],
    observe: 'Each pane has its own marker and prompt. Focus decides where ordinary typing goes.',
    recovery: 'If typing lands in the wrong pane, click the intended pane before trying again. If the right-click menu goes to the application, use an idle shell pane or the keyboard split in the next lesson.',
    question: 'Where does ordinary typing go in terminal mode?',
    choices: ['Every pane simultaneously', 'The focused pane', 'Always the first pane created'], answer: 1,
    why: 'Focus routes input. The browser has its own focus too—click Herdr before typing a command.'
  },
  {
    title: 'Meet the occupant', tag: '05 / Agent',
    intro: 'Herdr owns terminals, not the intelligence inside them. It recognizes supported agent processes and reports their state.',
    goal: 'Start your already-configured agent in a practice pane, send one harmless prompt, and inspect its state from the sibling shell.',
    steps: ['In an idle practice pane, start an agent you already use. For this machine, hermes is the example. Launching it yourself is intentional; the site never starts processes.', 'Send: “Reply with exactly READY. Do not use tools or change any files.” This is a real model request and may cost tokens. No new credentials or integration installation are required for this exercise.', 'While the agent runs, watch the sidebar. Then click the sibling SHELL pane and run herdr agent list. Copy the agent’s actual pane_id into the explain command; replace PANE_ID before running it.', 'A fast request may finish before you notice working. Done means finished and unseen; idle can mean ready and already seen. Focus the agent and notice whether its badge changes. If it is blocked, inspect the approval or question—never blindly approve it.'],
    commands: [['Idle school pane · existing configured agent', 'hermes'], ['Sibling school SHELL · not the agent prompt', 'herdr agent list'], ['Sibling shell · replace PANE_ID with the returned ID', 'herdr agent explain PANE_ID']],
    observe: 'An agent row or diagnostic describing detection. A missing row or unknown state is a reason to inspect, not evidence that the task completed.',
    recovery: 'If no agent is configured, use an existing one later rather than entering secrets here. Leave this mission incomplete for now. For detection trouble, compare herdr agent list, herdr agent explain with a real ID, and herdr integration status. Integration features differ by agent; installing one does not universally improve state detection.',
    question: 'Which state requires you to inspect an approval or question?',
    choices: ['Done', 'Unknown', 'Blocked'], answer: 2,
    why: 'Blocked means Herdr recognized a request for input. Unknown is uncertainty, not completion.'
  },
  {
    title: 'Teach your hands', tag: '06 / Modes & shortcuts',
    intro: 'Terminal mode talks to the pane. Prefix mode tells Herdr what to do. It is a sequence, not one giant chord.',
    goal: 'Open live Help, split down, move focus, and zoom a pane in and out using the keyboard.',
    steps: ['In Herdr, press Ctrl+b, RELEASE both keys, then press ?. This is live Help: if any binding differs from this guide, follow Help. Close the Help surface using its on-screen control.', 'Focus an idle school shell. Press Ctrl+b, release, then minus (-) to split down. Ctrl+b then v would split right.', 'Use separate prefix sequences with h / j / k / l to move left / down / up / right where a neighbor exists. Use Ctrl+b then z twice to zoom and unzoom.', 'Create a tab with Ctrl+b then c; return using Ctrl+b then p (previous) or n (next). The prefix has to be pressed and released for EACH action.'],
    commands: [],
    observe: 'A split below the original pane; focus moves; zoom hides other panes temporarily without closing them.',
    recovery: 'Press these keys in the terminal, not your browser. If a binding does nothing, consult live Help or use the mouse. Your outer terminal or desktop may intercept a chord. No global rebinding is necessary to finish the course.',
    question: 'How do you split RIGHT with the default bindings?',
    choices: ['Press Ctrl+b, release both keys, then v', 'Hold Ctrl+b+v together', 'Type the letters prefix+v into the shell'], answer: 0,
    why: 'The prefix arms one Herdr action. Releasing it before the action key is the motor pattern to practise.'
  },
  {
    title: 'Know what you’re targeting', tag: '07 / CLI & IDs',
    intro: 'The CLI is useful when a script needs to be precise. Stable IDs beat guessing from sidebar position.',
    goal: 'Inspect your current pane, then create a sibling without stealing your focus.',
    steps: ['In a school SHELL pane, run the current-pane command. Read the returned pane_id; don’t copy an example ID from the internet.', 'Run the split command. It explicitly targets the calling pane, inherits the working directory, and preserves focus.', 'Read the new pane’s ID from the response. Don’t run more splits just because focus did not move—that was the requested behavior.'],
    commands: [['Inside a school shell · read only', 'herdr pane current --current'], ['Inside that shell · creates one sibling', 'herdr pane split --current --direction right --cwd "$PWD" --no-focus']],
    observe: 'A new pane appears, while input remains in the old pane. The returned identifier names the new pane.',
    recovery: 'If the layout is getting cramped, use a new empty practice tab before splitting. IDs belong to one server, so never reuse a school-session ID in your work session or on another machine.',
    question: 'What should automation use to target the pane it just created?',
    choices: ['The ID it expects will come next', 'The ID returned by the creation response', 'Whichever pane a different client has focused'], answer: 1,
    why: 'IDs are opaque and session-scoped. Parse what Herdr returns; do not predict them.'
  },
  {
    title: 'Leave without losing the job', tag: '08 / Persistence',
    intro: 'Detach removes the client. It does not stop the server or the running process. Prove it with a ticking counter.',
    goal: 'Leave a counter running, detach, reattach, and see it continue.',
    steps: ['In an idle school shell, run the Python counter. Note the number; it stays in the foreground and only prints ticks.', 'Press Ctrl+b, release, then q to detach. You are back in the OUTER terminal. Wait a few seconds.', 'From that outer terminal, reattach to herdr-school using the second command. The counter should have advanced, not restarted.', 'Click the counter pane and press Ctrl+c to stop ONLY that foreground counter. Don’t use server stop as a substitute for detaching.'],
    commands: [['School shell · starts a harmless foreground counter', 'python3 -u -c "import time,itertools\nfor n in itertools.count():\n print(n)\n time.sleep(1)"'], ['Outer terminal · after detaching', 'herdr --session herdr-school']],
    observe: 'The same counter continues after reattachment. The server, not the visible terminal window, owns it.',
    recovery: 'If you are looking at an empty different session, detach and attach the exact same school-session name. A server restart is different: processes are lost; layout and supported native agent conversations may be restored. Don’t test that by stopping your real work.',
    question: 'Which action keeps your running pane processes alive?',
    choices: ['Stop the Herdr server', 'Close the pane containing the process', 'Detach the client'], answer: 2,
    why: 'Detach leaves processes running. Server stop and pane close are destructive to their processes.'
  },
  {
    title: 'Build your own cockpit', tag: '09 / Capstone',
    intro: 'Now stop following recipes. Recreate a useful working environment from an outcome, not a sequence of buttons.',
    goal: 'In your school session, make a tab named Cockpit with two shell panes. Print a different label in each, zoom and unzoom, inspect your current pane’s ID, then detach and return. Do this without hints.',
    steps: ['Create and name a tab (mouse menu or Ctrl+b then c). In that empty tab, split right with Ctrl+b then v.', 'Print a different label in each shell using printf. Focus each in turn. Zoom and unzoom using Ctrl+b then z.', 'At a shell prompt, run herdr pane current --current. Identify its pane ID from the actual result.', 'Detach with Ctrl+b then q. Reattach from the outer terminal using the same school-session name. Your Cockpit layout and shell output should still be there.', 'After checking the result, explain out loud: session → workspace → tab → pane → agent. Tomorrow, repeat this mission in Recall mode before looking at any hints.'],
    commands: [],
    observe: 'A named tab, independent panes, successful zoom, a real pane ID, and a preserved layout after detach. You should be able to explain why that is not the same as a server restart.',
    recovery: 'Use live Help (Ctrl+b then ?) when stuck. Looking something up is a skill, not a failure. Leave the practice session detached when finished. Close only practice panes whose processes you have intentionally finished; never stop the default server as cleanup.',
    question: 'Which order describes Herdr’s structure from outside to inside?',
    choices: ['Session → workspace → tab → pane → agent', 'Agent → session → pane → workspace → tab', 'Tab → session → agent → workspace → pane'], answer: 0,
    why: 'A session contains workspaces; workspaces hold tab layouts; panes are terminals where agents may run.'
  }
];
const storageKey = 'herdr-field-guide-v1';
const el = id => document.getElementById(id);
let state = {index:0, mode:'guided', done:[]};
let storageOK = true;
try {
  const saved = JSON.parse(localStorage.getItem(storageKey));
  if (saved && Number.isInteger(saved.index) && saved.index >= 0 && saved.index < lessons.length && Array.isArray(saved.done)) {
    state = {index:saved.index, mode:saved.mode === 'recall' ? 'recall' : 'guided', done:[...new Set(saved.done.filter(i => Number.isInteger(i) && i >= 0 && i < lessons.length))]};
  }
} catch (_) { storageOK = false; }
let passed = false;
function save() {
  try {localStorage.setItem(storageKey, JSON.stringify(state));} catch (_) {storageOK = false;}
  el('storageWarning').hidden = storageOK;
}
function setMode(mode) {state.mode=mode; save(); render();}
function gate() {el('complete').disabled = !(passed && el('didIt').checked);}
function go(index) {state.index=index; if(index===lessons.length-1)state.mode='recall'; save(); render(); el('missionTitle').focus();}
function render() {
  const lesson=lessons[state.index];
  passed=false;
  el('progress').max=lessons.length;
  el('progress').value=state.done.length;
  el('progressText').textContent=`${state.done.length} / ${lessons.length} missions completed`;
  el('completion').hidden=state.done.length !== lessons.length;
  el('missions').replaceChildren(...lessons.map((l,i) => {
    const button=document.createElement('button');
    const num=document.createElement('span'); num.className='num'; num.textContent=state.done.includes(i)?'✓':String(i+1).padStart(2,'0');
    const text=document.createElement('span'); text.textContent=l.title;
    button.append(num,text);
    button.setAttribute('aria-label',`${i+1}. ${l.title}${state.done.includes(i)?', completed':''}`);
    if(i===state.index) button.setAttribute('aria-current','step');
    button.onclick=()=>go(i);return button;
  }));
  el('missionMeta').textContent=lesson.tag;
  el('missionTitle').textContent=lesson.title;
  el('missionIntro').textContent=lesson.intro;
  el('goal').textContent=lesson.goal;
  el('observe').textContent=lesson.observe;
  el('recoveryText').textContent=lesson.recovery;
  el('recovery').open=false;
  const steps=document.createElement('ol');
  lesson.steps.forEach(text=>{const li=document.createElement('li');li.textContent=text;steps.append(li);});
  el('instructions').replaceChildren(steps);
  lesson.commands.forEach(([label,command])=>{
    const box=document.createElement('div');box.className='command';
    const caption=document.createElement('div');caption.className='caption';caption.textContent=label;
    const pre=document.createElement('pre');const code=document.createElement('code');code.textContent=command;pre.append(code);
    const copy=document.createElement('button');copy.textContent='Copy command';copy.setAttribute('aria-label',`Copy: ${label}`);
    copy.onclick=async()=>{try {await navigator.clipboard.writeText(command);copy.textContent='Copied — paste in your terminal';}catch(_){copy.textContent='Select the command above and copy manually';}};
    box.append(caption,pre,copy);el('instructions').append(box);
  });
  el('guided').setAttribute('aria-pressed',String(state.mode==='guided'));
  el('recall').setAttribute('aria-pressed',String(state.mode==='recall'));
  el('instructions').hidden=state.mode==='recall';el('hiddenHelp').hidden=state.mode!=='recall';
  el('didIt').checked=false;el('feedback').textContent='To continue: confirm the terminal task AND choose the correct answer.';
  el('question').textContent=lesson.question;
  el('answers').replaceChildren(...lesson.choices.map((text,i)=>{
    const button=document.createElement('button');button.textContent=text;
    button.onclick=()=>{
      passed=i===lesson.answer;
      for(const b of el('answers').children) delete b.dataset.result;
      button.dataset.result=passed?'right':'wrong';
      el('feedback').textContent=passed?`Correct. ${lesson.why}`:`Not quite. ${lesson.why} Try again.`;
      gate();
    };return button;
  }));
  el('previous').disabled=state.index===0;
  el('complete').textContent=state.index===lessons.length-1?'Finish fieldwork ✓':'Complete & continue →';
  el('missionStatus').textContent=state.done.includes(state.index)?'Previously completed. Repeat the task and check to practise again.':'Progress is stored in this browser. You can revisit any mission.';
  el('storageWarning').hidden=storageOK;gate();
}
el('guided').onclick=()=>setMode('guided');el('recall').onclick=()=>setMode('recall');
el('reveal').onclick=()=>{el('instructions').hidden=false;el('hiddenHelp').hidden=true;};
el('didIt').onchange=gate;
el('previous').onclick=()=>{if(state.index>0)go(state.index-1);};
el('complete').onclick=()=>{
  if(!passed || !el('didIt').checked)return;
  if(!state.done.includes(state.index))state.done.push(state.index);
  if(state.index<lessons.length-1)state.index++;
  if(state.index===lessons.length-1)state.mode='recall';
  save();render();el('missionTitle').focus();
};
el('review').onclick=()=>{state.mode='recall';go(lessons.length-1);};
el('reset').onclick=()=>{if(confirm('Reset this browser’s course progress? Your real Herdr session will not be touched.')){state={index:0,mode:'guided',done:[]};save();render();}};
render();
