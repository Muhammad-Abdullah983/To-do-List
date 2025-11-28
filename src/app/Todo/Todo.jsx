"use client";

import React, { useEffect, useRef, useState } from "react";

const STORAGE_KEY = "todos:v1";

export default function Todo() {
    const [text, setText] = useState("");
    const [todos, setTodos] = useState(() => {
        try {
            if (typeof window === "undefined") return [];
            const raw = localStorage.getItem(STORAGE_KEY);
            return raw ? JSON.parse(raw) : [];
        } catch {
            return [];
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
        } catch { }
    }, [todos]);

    function newId() {
        return (typeof crypto !== "undefined" && crypto.randomUUID)
            ? crypto.randomUUID()
            : String(Date.now()) + Math.random().toString(36).slice(2, 9);
    }

    function addTodo() {
        const t = text.trim();
        if (!t) return;
        const item = { id: newId(), text: t, done: false, createdAt: Date.now() };
        setTodos((s) => [item, ...s]);
        setText("");
    }

    const [editingId, setEditingId] = useState(null);
    const [editText, setEditText] = useState("");
    const editInputRef = useRef(null);

    useEffect(() => {
        if (editingId && editInputRef.current) {
            editInputRef.current.focus();
            editInputRef.current.select();
        }
    }, [editingId]);

    function startEdit(id, currentText) {
        setEditingId(id);
        setEditText(currentText);
    }

    function saveEdit(id) {
        const t = editText.trim();
        if (!t) return;
        setTodos((s) => s.map((it) => (it.id === id ? { ...it, text: t } : it)));
        setEditingId(null);
        setEditText("");
    }

    function cancelEdit() {
        setEditingId(null);
        setEditText("");
    }

    function toggleTodo(id) {
        setTodos((s) => s.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
    }

    function removeTodo(id) {
        setTodos((s) => s.filter((t) => t.id !== id));
    }

    function handleKeyDown(e) {
        if (e.key === "Enter") addTodo();
    }

    const remaining = todos.filter((t) => !t.done).length;

    return (
        <section
            className="max-w-xl mx-6 sm:mx-auto 
    px-3 sm:px-6 p-6 mt-10
    bg-linear-to-br from-white/20 via-white/30 to-white/40
    backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/30
    transition-all duration-300 animate-fade-in"
        >

            <h2
                className="text-4xl font-extrabold mb-6 text-center
                bg-gradient-to-r from-teal-400 via-cyan-500 to-indigo-600
                bg-clip-text text-transparent drop-shadow-lg"
            >
                Todo List
            </h2>

            {/* Add Input */}
            <div className="relative mb-5 animate-slide-up">
                <input
                    aria-label="New todo"
                    className="w-full rounded-xl border px-4 py-3 pr-14 shadow-md
                        focus:ring-2 focus:ring-cyan-400 focus:outline-none
                        transition-all duration-300 backdrop-blur-md bg-white/90
                        text-zinc-800"
                    placeholder="Add a new todo..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={handleKeyDown}
                />

                <button
                    aria-label="Add todo"
                    title="Add"
                    className={`absolute right-2 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full 
                        text-white flex items-center justify-center transition-all duration-300 
                        shadow-lg
                        ${text.trim()
                            ? "bg-linear-to-br from-cyan-500 via-teal-500 to-indigo-500 hover:scale-105"
                            : "bg-gray-300/40 cursor-not-allowed text-gray-700"}`}
                    onClick={addTodo}
                    disabled={!text.trim()}
                >
                    <span className="text-2xl leading-none">+</span>
                </button>
            </div>

            {/* Remaining */}
            <p className="mb-3 text-sm  font-medium animate-fade-in">
                {remaining} remaining
            </p>

            {/* Todo List */}
            <ul className="space-y-4">
                {todos.length === 0 && (
                    <li className="text-black-600 text-center animate-fade-in">
                        No todos yet — add one above.
                    </li>
                )}

                {todos.map((t) => (
                    <li
                        key={t.id}
                        className="flex items-center justify-between gap-4 rounded-xl border p-4 
                                bg-linear-to-br from-white/90 to-white/70 
                                backdrop-blur-xl shadow-xl hover:shadow-cyan-300/30 
                                transition-all duration-300 animate-fade-in"
                    >
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                            <input
                                type="checkbox"
                                checked={t.done}
                                onChange={() => toggleTodo(t.id)}
                                className="w-5 h-5 rounded cursor-pointer accent-cyan-500 shrink-0"
                            />

                            {editingId === t.id ? (
                                <input
                                    ref={editInputRef}
                                    className="min-w-0 w-full rounded-lg border px-3 py-1 
                                        focus:ring-2 focus:ring-cyan-400 
                                        bg-white/80 backdrop-blur-md text-zinc-800"
                                    value={editText}
                                    onChange={(e) => setEditText(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") saveEdit(t.id);
                                        if (e.key === "Escape") cancelEdit();
                                    }}
                                    onBlur={() => saveEdit(t.id)}
                                />
                            ) : (
                                <span
                                    className={`min-w-0 truncate ${t.done
                                        ? "line-through text-zinc-400"
                                        : "text-zinc-800 font-medium"} transition-all duration-300`}
                                >
                                    {t.text}
                                </span>
                            )}
                        </div>

                        <div className="flex items-center gap-4 shrink-0">
                            {editingId === t.id ? (
                                <>
                                    <button
                                        className="text-sm px-3 py-1 rounded-lg 
                                            bg-emerald-500/20 text-emerald-700 hover:bg-emerald-500/30 
                                            transition font-medium"
                                        onClick={() => saveEdit(t.id)}
                                    >
                                        Save
                                    </button>

                                    <button
                                        className="text-sm px-3 py-1 rounded-lg 
                                            bg-gray-200/30 text-gray-700 hover:bg-gray-200/50 
                                            transition font-medium"
                                        onClick={cancelEdit}
                                    >
                                        Cancel
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        className="text-sm px-3 py-1 rounded-lg 
                                            bg-cyan-500/10 text-cyan-700 hover:bg-cyan-500/20 
                                            transition font-medium"
                                        onClick={() => startEdit(t.id, t.text)}
                                    >
                                        Edit
                                    </button>

                                    <button
                                        className="text-sm px-3 py-1 rounded-lg 
                                            bg-red-500/20 text-red-700 hover:bg-red-500/30 
                                            transition font-medium"
                                        onClick={() => removeTodo(t.id)}
                                    >
                                        Delete
                                    </button>
                                </>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
        </section>
    );
}
