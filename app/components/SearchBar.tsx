import type { SearchBarProps } from "@/types";
import Form from "next/form";

export default function SearchBar({ isDark, t }: SearchBarProps) {
    return (
        <Form
            action=""
            className="flex-1 sm:flex-auto"
        >
            <input
                type="text"
                name="query"
                className={
                    "w-full rounded-lg border px-3 sm:px-4 py-2 text-sm outline-none transition" +
                    (isDark
                        ? "border-slate-700 bg-slate-900/40 text-slate-100 placeholder:text-slate-500 focus:border-[#7DB4E5]"
                        : "border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-[#145C9E] focus:bg-white")
                }
                placeholder={t('searchPlaceholder')}
            />
        </Form>
    );
}