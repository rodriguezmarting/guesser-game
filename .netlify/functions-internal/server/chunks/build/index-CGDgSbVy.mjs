import { jsxs, jsx, Fragment } from 'react/jsx-runtime';
import * as d from 'react';
import { useState, useEffect } from 'react';
import * as u from '@radix-ui/react-dialog';
import { X as X$1, Check, Search } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { N as Ne, $ as $r } from '../nitro/nitro.mjs';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import { Command } from 'cmdk';
import * as N from '@radix-ui/react-popover';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'vinxi/lib/invariant';
import 'vinxi/lib/path';
import 'node:url';
import 'node:async_hooks';
import '@tanstack/react-router';
import '@tanstack/react-router-devtools';
import 'node:stream';
import 'react-dom/server';
import 'node:stream/web';
import 'node:fs';
import 'node:path';
import 'node:crypto';

function l(...t) {
  return twMerge(clsx(t));
}
const Z = u.Root, X = u.Trigger, J = u.Portal, _ = d.forwardRef(({ className: t, ...a }, o) => jsx(u.Overlay, { ref: o, className: l("fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", t), ...a }));
_.displayName = u.Overlay.displayName;
const D = d.forwardRef(({ className: t, children: a, ...o }, r) => jsxs(J, { children: [jsx(_, {}), jsxs(u.Content, { ref: r, className: l("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg", t), ...o, children: [a, jsxs(u.Close, { className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground", children: [jsx(X$1, { className: "h-4 w-4" }), jsx("span", { className: "sr-only", children: "Close" })] })] })] }));
D.displayName = u.Content.displayName;
const I = ({ className: t, ...a }) => jsx("div", { className: l("flex flex-col space-y-1.5 text-center sm:text-left", t), ...a });
I.displayName = "DialogHeader";
const j = d.forwardRef(({ className: t, ...a }, o) => jsx(u.Title, { ref: o, className: l("text-lg font-semibold leading-none tracking-tight", t), ...a }));
j.displayName = u.Title.displayName;
const L = d.forwardRef(({ className: t, ...a }, o) => jsx(u.Description, { ref: o, className: l("text-sm text-muted-foreground", t), ...a }));
L.displayName = u.Description.displayName;
const W = [{ tries: 5, label: "5 tries left", type: "visual", title: "Visual Clue", description: "A glimpse of the character's appearance" }, { tries: 8, label: "8 tries left", type: "quote", title: "Quote Clue", description: "A memorable line from the character" }, { tries: 10, label: "10 tries left", type: "sound", title: "Sound Clue", description: "Listen to the character's voice" }];
function ee({ guesses: t, hasWon: a, characterOfTheDay: o, activeClue: r, setActiveClue: m }) {
  const p = (i) => {
    if (a) return "View clue";
    const s = i - t.length;
    return s <= 0 ? "Clue ready!" : `${s} tries left`;
  }, g = (i) => {
    (a || t.length >= i.tries) && m(i);
  }, x = () => {
    if (!r) return null;
    switch (r.type) {
      case "visual":
        return jsxs("div", { className: "flex flex-col items-center gap-4", children: [jsx("img", { src: o.image, alt: "Character silhouette", className: "w-48 h-48 object-cover filter brightness-0 border-[1px] border-content rounded-sm" }), jsx("p", { className: "text-content-muted text-sm", children: "This is a silhouette of the character. Notice any distinctive features?" })] });
      case "quote":
        return jsxs("div", { className: "flex flex-col items-center gap-4", children: [jsxs("blockquote", { className: "text-content text-lg italic border-l-2 border-content pl-4", children: ['"', te(o.value), '"'] }), jsx("p", { className: "text-content-muted text-sm", children: "A memorable line that reveals their personality" })] });
      case "sound":
        return jsxs("div", { className: "flex flex-col items-center gap-4", children: [jsxs("audio", { controls: true, className: "w-full [&::-webkit-media-controls-panel]:bg-olive [&::-webkit-media-controls-panel]:border-content [&::-webkit-media-controls-panel]:border [&::-webkit-media-controls-playback-rate-button]:hidden", controlsList: "noplaybackrate", children: [jsx("source", { src: ae(o.value), type: "audio/mpeg" }), "Your browser does not support the audio element."] }), jsx("p", { className: "text-content-muted text-sm", children: "Listen carefully to their voice and manner of speaking" })] });
    }
  };
  return jsx("div", { className: "mt-3 w-full flex justify-center text-content", children: jsxs("div", { className: "flex-1 flex flex-col gap-2", children: [jsxs("div", { className: "flex justify-between border-content border-2 border-x-0 text-content font-bold text-lg", children: [jsx("span", { children: "\u25BC\u25BC\u25BC" }), jsx("h4", { children: "Clues" }), jsx("span", { children: "\u25BC\u25BC\u25BC" })] }), jsx("ul", { className: "mt-2 flex gap-4 justify-center", children: W.map((i, s) => jsx("li", { children: jsxs(Z, { children: [jsx(X, { asChild: true, children: jsxs("button", { onClick: () => g(i), className: "flex flex-col items-center", disabled: !a && t.length < i.tries, children: [jsx("img", { src: "/images/avatar-emblem.avif", alt: "Avatar Emblem", className: `shadow-md p-1 w-14 h-14 border-[1px] border-content rounded-sm ${a || t.length >= i.tries ? "opacity-100" : "opacity-50"}` }), jsx("label", { className: "mt-1 w-14 text-content-muted text-sm", children: p(i.tries) })] }) }), jsxs(D, { className: "bg-olive-light border-content text-content font-herculanum", children: [jsxs(I, { children: [jsx(j, { className: "text-xl text-content", children: i.title }), jsx(L, { className: "text-content-muted", children: i.description })] }), x()] })] }) }, s)) })] }) });
}
function te(t) {
  return { Aang: "When we hit our lowest point, we are open to the greatest change.", Zuko: "I'm going to speak my mind, and you're going to listen.", Katara: "I will never, ever turn my back on people who need me!", Sokka: "I'm just a guy with a boomerang. I didn't ask for all this flying and magic!", Toph: "I am not Toph! I am MELON LORD! MWAHAHAHA!", Iroh: "In the darkest times, hope is something you give yourself.", Azula: "I'm about to celebrate becoming an only child!" }[t] || "A mysterious quote from the character...";
}
function ae(t) {
  return { Aang: "/sounds/aang.mp3", Zuko: "/sounds/zuko.mp3", Katara: "/sounds/katara.mp3" }[t] || "/sounds/default.mp3";
}
const oe = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", { variants: { variant: { default: "bg-primary text-primary-foreground hover:bg-primary/90", destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90", outline: "border border-content bg-olive-light hover:bg-olive hover:text-accent-foreground", secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80", ghost: "hover:bg-accent hover:text-accent-foreground", link: "text-primary underline-offset-4 hover:underline" }, size: { default: "h-10 px-4 py-2", sm: "h-9 rounded-md px-3", lg: "h-11 rounded-md px-8", icon: "h-10 w-10" } }, defaultVariants: { variant: "default", size: "default" } }), S = d.forwardRef(({ className: t, variant: a, size: o, asChild: r = false, ...m }, p) => jsx(r ? Slot : "button", { className: l(oe({ variant: a, size: o, className: t })), ref: p, ...m }));
S.displayName = "Button";
const z = d.forwardRef(({ className: t, ...a }, o) => jsx(Command, { ref: o, className: l("flex h-full w-full flex-col overflow-hidden rounded-md bg-olive-light text-popover-foreground", t), ...a }));
z.displayName = Command.displayName;
const E = d.forwardRef(({ className: t, ...a }, o) => jsxs("div", { className: "flex items-center border-b border-content px-3", "cmdk-input-wrapper": "", children: [jsx(Search, { className: "mr-2 h-4 w-4 shrink-0 opacity-50" }), jsx(Command.Input, { ref: o, className: l("flex h-11 w-full bg-transparent py-3 text-sm outline-none placeholder:text-content-muted disabled:cursor-not-allowed disabled:opacity-50", t), ...a })] }));
E.displayName = Command.Input.displayName;
const P = d.forwardRef(({ className: t, ...a }, o) => jsx(Command.List, { ref: o, className: l("max-h-[300px] overflow-y-auto overflow-x-hidden", t), ...a }));
P.displayName = Command.List.displayName;
const H = d.forwardRef((t, a) => jsx(Command.Empty, { ref: a, className: "py-6 text-center text-sm", ...t }));
H.displayName = Command.Empty.displayName;
const B = d.forwardRef(({ className: t, ...a }, o) => jsx(Command.Group, { ref: o, className: l("overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground", t), ...a }));
B.displayName = Command.Group.displayName;
const ne = d.forwardRef(({ className: t, ...a }, o) => jsx(Command.Separator, { ref: o, className: l("-mx-1 h-px bg-border", t), ...a }));
ne.displayName = Command.Separator.displayName;
const T = d.forwardRef(({ className: t, ...a }, o) => jsx(Command.Item, { ref: o, className: l("relative flex cursor-default gap-2 select-none items-center px-[2px] py-1 text-sm outline-none data-[disabled=true]:pointer-events-none data-[selected='true']:bg-olive-dark data-[selected=true]:text-white data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", t), ...a }));
T.displayName = Command.Item.displayName;
const re = N.Root, ie = N.Trigger, q = d.forwardRef(({ className: t, align: a = "center", sideOffset: o = 4, ...r }, m) => jsx(N.Portal, { children: jsx(N.Content, { ref: m, align: a, sideOffset: o, className: l("z-50 w-72 border border-content bg-olive-light p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-popover-content-transform-origin]", t), ...r }) }));
q.displayName = N.Content.displayName;
function se({ selectedCharacter: t, setSelectedCharacter: a, disabled: o }) {
  const [r, m] = d.useState(false), [p, g] = useState([]), [x, i] = useState(true);
  return useEffect(() => {
    async function s() {
      const b = await $r();
      g(b), i(false);
    }
    s();
  }, []), jsxs(re, { open: r, onOpenChange: m, children: [jsx(ie, { asChild: true, children: jsx(S, { variant: "outline", role: "combobox", "aria-expanded": r, className: "w-[200px] justify-between", disabled: o, children: t ? t.label : "Select character..." }) }), jsx(q, { className: "w-[200px] p-0 font-herculanum", children: jsxs(z, { children: [jsx(E, { placeholder: "Search character...", className: "h-9" }), jsxs(P, { children: [jsx(H, { children: "No character found." }), jsx(B, { children: x ? jsx("div", { children: "Loading..." }) : p.map((s) => jsxs(T, { value: s.value, onSelect: (b) => {
    const h = p.find((w) => w.value === b);
    h && (a(h), m(false));
  }, children: [jsx("img", { src: s.imageUrl, alt: s.label, className: "shadow-md w-11 h-11 border-[1px] border-content rounded-sm" }), s.label, jsx(Check, { className: l("ml-auto", (t == null ? void 0 : t.value) === s.value ? "opacity-100" : "opacity-0") })] }, s.value)) })] })] }) })] });
}
function le({ selectedCharacter: t, setSelectedCharacter: a, handleSubmit: o, hasWon: r, duplicateGuess: m }) {
  const [p, g] = useState(false), [x, i] = useState([]), [s, b] = useState(true);
  return useEffect(() => {
    async function h() {
      const w = await $r();
      i(w), b(false);
    }
    h();
  }, []), jsxs("div", { className: "flex flex-col items-center gap-4 w-full max-w-sm", children: [jsxs("div", { className: "mt-4 flex justify-center max-w-sm items-center space-x-2", children: [jsx(se, { selectedCharacter: t, setSelectedCharacter: a, disabled: r }), jsx(S, { type: "submit", onClick: o, disabled: !t || r, className: "bg-olive hover:bg-olive/80 rounded-none text-[#78D6FF] text-2xl drop-shadow-[0_0_2px_rgba(120,214,255,0.6)] hover:drop-shadow-[0_0_4px_rgba(120,214,255,0.8)] disabled:opacity-50 disabled:cursor-not-allowed", children: "\u25B6" })] }), m && jsxs("p", { className: "text-red-500 text-sm font-herculanum", children: ["You already guessed ", m] }), r && jsx("p", { className: "text-content mt-3 text-lg font-bold", children: "Congratulations! You've guessed the character!" })] });
}
function y() {
  return jsx("img", { src: "/images/avatar-emblem.avif", alt: "Avatar Emblem", className: "shadow-md p-1 w-16 h-16 border-[1px] border-content rounded-sm" });
}
function F({ children: t }) {
  return jsx("div", { className: "mt-2 flex justify-center max-w-sm items-end space-x-2 text-xs", children: t });
}
function de() {
  return jsxs(F, { children: [jsx(y, {}), jsx(y, {}), jsx(y, {}), jsx(y, {}), jsx(y, {})] });
}
function C({ title: t, status: a, index: o }) {
  return jsx("div", { className: "relative w-16 h-16", children: jsxs("div", { className: l("relative w-full h-full transition-all duration-500 [transform-style:preserve-3d]", "animate-flip"), style: { animationDelay: `${o * 200}ms` }, children: [jsx("div", { className: "absolute w-full h-full [backface-visibility:hidden]", children: jsx("img", { src: "/images/avatar-emblem.avif", alt: "Avatar Emblem", className: "shadow-md p-1 w-full h-full border-[1px] border-content rounded-sm" }) }), jsx("div", { className: l("absolute w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)]", "flex justify-center items-center shadow-md border-[1px] border-content rounded-sm", a === "right" ? "bg-[#514A05]" : a === "wrong" ? "bg-[#92120a]" : "bg-[#ffa500]"), children: jsx("span", { className: "flex justify-center items-center w-[99%] h-[99%] border-white text-white border-[1px] rounded-sm text-xs", children: t }) })] }) });
}
function ce({ userGuess: t, characterOfTheDay: a }) {
  return jsxs(F, { children: [jsx("img", { src: t.imageUrl, alt: t.value, className: "shadow-md w-16 h-16 border-[1px] border-content rounded-sm" }), jsx(C, { title: t.gender, status: k(t.gender, a.gender), index: 0 }), jsx(C, { title: t.fightingStyle, status: k(t.fightingStyle, a.fightingStyle), index: 1 }), jsx(C, { title: t.nationality, status: k(t.nationality, a.nationality), index: 2 }), jsx(C, { title: t.firstAppearance, status: k(t.firstAppearance, a.firstAppearance), index: 3 })] });
}
function k(t, a) {
  return t === a ? "right" : "wrong";
}
function me({ guesses: t, characterOfTheDay: a, hasWon: o }) {
  return jsxs(Fragment, { children: [jsxs("p", { className: "text-content-muted mt-3 text-xs", children: [jsx("span", { className: "text-sm text-content", children: "12311" }), " people already guessed the character"] }), jsxs("div", { className: "mt-4 flex justify-center max-w-sm items-end space-x-2 text-[10px] text-center", children: [jsx("div", { className: "w-16 border-b-2 border-content", children: "Character" }), jsx("div", { className: "w-16 border-b-2 border-content", children: "Gender" }), jsx("div", { className: "w-16 border-b-2 border-content", children: "Fighting Style" }), jsx("div", { className: "w-16 border-b-2 border-content", children: "Nationality" }), jsx("div", { className: "w-16 border-b-2 border-content", children: "Debut" })] }), jsxs("div", { className: "h-[300px] overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden", children: [t.map((r) => jsx(ce, { userGuess: r, characterOfTheDay: a }, r.value)), !t.length && !o && jsx(de, {})] })] });
}
const _e = function() {
  const [a, o] = useState(), [r, m] = useState([]), [p, g] = useState(false), [x, i] = useState(null), [s, b] = useState(null), { characterOfTheDay: h } = Ne.useLoaderData();
  return jsxs("div", { className: "p-4 min-h-[200vh] bg-[#8B8B6E] bg-opacity-40 relative", children: [jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-[#A5A58D] via-[#8B8B6E] to-[#6B705C] opacity-60" }), jsx("div", { className: "absolute inset-0 backdrop-filter backdrop-blur-[1px]" }), jsxs("div", { className: "mt-2 font-herculanum relative flex flex-col items-center bg-transparent text-center", children: [jsx("h1", { className: "tracking-wider text-2xl text-content", children: "Guess today's Avatar Character" }), jsx(ee, { guesses: r, hasWon: p, characterOfTheDay: h, activeClue: s, setActiveClue: b }), jsx(le, { selectedCharacter: a, setSelectedCharacter: (v) => {
    o(v), i(null);
  }, handleSubmit: () => {
    if (a) {
      if (r.some((v) => v.value === a.value)) {
        i(a.label);
        return;
      }
      m((v) => [a, ...v]), o(void 0), i(null), a.value === h.value && g(true);
    }
  }, hasWon: p, duplicateGuess: x }), jsx(me, { guesses: r, characterOfTheDay: h, hasWon: p })] })] });
};

export { _e as component };
//# sourceMappingURL=index-CGDgSbVy.mjs.map
