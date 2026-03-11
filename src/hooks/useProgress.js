import { useState, useEffect } from "react";
import { supabase } from "../supabase";

const DEFAULT_PROGRESS = {
  reading: { currentLevel: 1, stars: {} },
  math: { currentLevel: 1, stars: {} },
  grammar: { currentLevel: 1, stars: {} },
};

export function useProgress(user) {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setProgress(null);
      setLoading(false);
      return;
    }

    fetchProgress();

    // Real-time listener
    const channel = supabase
      .channel("user_progress_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "user_progress",
          filter: `user_id=eq.${user.id}`,
        },
        () => fetchProgress()
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [user?.id]);

  const fetchProgress = async () => {
    const { data, error } = await supabase
      .from("user_progress")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (error || !data) {
      // Create row if missing
      await supabase.from("user_progress").upsert({
        user_id: user.id,
        name: user.user_metadata?.display_name || "קוֹסֵם",
        reading_current_level: 1,
        reading_stars: {},
        math_current_level: 1,
        math_stars: {},
        grammar_current_level: 1,
        grammar_stars: {},
      });
      setProgress(DEFAULT_PROGRESS);
    } else {
      setProgress({
        reading: {
          currentLevel: data.reading_current_level || 1,
          stars: data.reading_stars || {},
        },
        math: {
          currentLevel: data.math_current_level || 1,
          stars: data.math_stars || {},
        },
        grammar: {
          currentLevel: data.grammar_current_level || 1,
          stars: data.grammar_stars || {},
        },
      });
    }
    setLoading(false);
  };

  return { progress, loading };
}
