import { useEffect, useMemo, useState } from 'react';
import { apiFetch } from '../lib/api';

function formatTime(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleString();
  } catch {
    return '';
  }
}

export default function Forum() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [text, setText] = useState('');
  const [images, setImages] = useState([]);
  const [busy, setBusy] = useState(false);

  const [openPostId, setOpenPostId] = useState('');
  const [commentsByPost, setCommentsByPost] = useState({});
  const [commentDraftByPost, setCommentDraftByPost] = useState({});
  const [replyToByPost, setReplyToByPost] = useState({});

  async function load() {
    setError('');
    setLoading(true);
    try {
      const data = await apiFetch('/forum/posts');
      setPosts(data?.posts || []);
    } catch (err) {
      setError(err.message || 'Failed to load forum');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function submit(e) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const form = new FormData();
      form.append('text', text);
      for (const f of images) form.append('images', f);
      await apiFetch('/forum/posts', { method: 'POST', body: form, isForm: true });
      setText('');
      setImages([]);
      await load();
    } catch (err) {
      setError(err.message || 'Failed to post');
    } finally {
      setBusy(false);
    }
  }

  async function like(postId) {
    try {
      await apiFetch(`/forum/posts/${postId}/like`, { method: 'POST' });
      await load();
    } catch (err) {
      setError(err.message || 'Failed to like');
    }
  }

  async function removePost(postId) {
    try {
      await apiFetch(`/forum/posts/${postId}`, { method: 'DELETE' });
      await load();
    } catch (err) {
      setError(err.message || 'Failed to delete');
    }
  }

  async function loadComments(postId) {
    try {
      const data = await apiFetch(`/forum/posts/${postId}/comments`);
      setCommentsByPost((s) => ({ ...s, [postId]: data?.comments || [] }));
    } catch (err) {
      setError(err.message || 'Failed to load comments');
    }
  }

  async function addComment(postId) {
    const text = String(commentDraftByPost[postId] || '').trim();
    if (!text) return;
    try {
      await apiFetch(`/forum/posts/${postId}/comments`, {
        method: 'POST',
        body: { text, parentCommentId: replyToByPost[postId] || null },
      });
      setCommentDraftByPost((s) => ({ ...s, [postId]: '' }));
      setReplyToByPost((s) => ({ ...s, [postId]: '' }));
      await loadComments(postId);
      await load();
    } catch (err) {
      setError(err.message || 'Failed to comment');
    }
  }

  async function removeComment(postId, commentId) {
    try {
      await apiFetch(`/forum/comments/${commentId}`, { method: 'DELETE' });
      await loadComments(postId);
      await load();
    } catch (err) {
      setError(err.message || 'Failed to delete comment');
    }
  }

  function threadify(comments) {
    const roots = [];
    const byId = new Map();
    comments.forEach((c) => byId.set(c._id, { ...c, replies: [] }));
    byId.forEach((c) => {
      if (c.parentCommentId && byId.has(c.parentCommentId)) byId.get(c.parentCommentId).replies.push(c);
      else roots.push(c);
    });
    return roots;
  }

  return (
    <div>
      <div className="max-w-[70ch]">
        <div className="font-serif text-greenDeep text-[52px] leading-[1.06] tracking-wide">Forum</div>
        <div className="mt-4 text-neutral-900/65 tracking-wide leading-[1.75]">Share progress with images. Discuss with comments and replies.</div>
      </div>

      {error ? (
        <div className="mt-8 rounded-2xl bg-gold/15 border border-gold/40 px-6 py-4 text-neutral-900/80 tracking-wide">{error}</div>
      ) : null}

      <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl bg-beige/40 border border-neutral-900/10 p-7 shadow-[0_14px_26px_rgba(17,24,19,0.08)]">
          <div className="text-[13px] uppercase tracking-[0.12em] text-neutral-900/55">Create</div>
          <div className="mt-3 font-serif text-greenDeep text-[28px] leading-[1.12] tracking-wide">New post</div>
          <form className="mt-6 space-y-4" onSubmit={submit}>
            <label className="block">
              <div className="text-[13px] tracking-[0.08em] text-neutral-900/55 mb-2">Text</div>
              <textarea
                className="w-full min-h-[160px] rounded-xl border border-neutral-900/10 bg-cream/80 px-4 py-3 outline-none focus:border-greenDeep/30 transition resize-y"
                value={text}
                onChange={(e) => setText(e.target.value)}
                required
              />
            </label>
            <label className="block">
              <div className="text-[13px] tracking-[0.08em] text-neutral-900/55 mb-2">Images (optional)</div>
              <input
                className="w-full rounded-xl border border-neutral-900/10 bg-cream/80 px-4 py-3 outline-none focus:border-greenDeep/30 transition"
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => setImages(Array.from(e.target.files || []).slice(0, 4))}
              />
            </label>
            <div className="flex flex-wrap gap-4">
              <button className="px-6 py-3 rounded-xl bg-greenDeep text-cream text-[14px] tracking-wide hover:translate-y-[-2px] hover:shadow-lg transition" type="submit" disabled={busy}>
                {busy ? 'Publishing' : 'Publish'}
              </button>
              <button className="px-0 py-3 text-greenDeep text-[14px] tracking-wide hover:underline hover:tracking-wider transition" type="button" onClick={() => { setText(''); setImages([]); }}>
                Clear
              </button>
            </div>
          </form>
        </div>

        <div className="rounded-2xl bg-beige/40 border border-neutral-900/10 p-7 shadow-[0_14px_26px_rgba(17,24,19,0.08)]">
          <div className="text-[13px] uppercase tracking-[0.12em] text-neutral-900/55">Feed</div>
          <div className="mt-3 font-serif text-greenDeep text-[28px] leading-[1.12] tracking-wide">Latest posts</div>

          {loading ? <div className="mt-6 text-neutral-900/60 tracking-wide">Loading</div> : null}
          {!loading && posts.length === 0 ? <div className="mt-6 text-neutral-900/60 tracking-wide">No posts yet.</div> : null}

          <div className="mt-6 space-y-6">
            {posts.map((p) => (
              <div key={p._id} className="rounded-2xl bg-cream/70 border border-neutral-900/10 p-7 hover:-translate-y-1 transition duration-700 ease-in-out">
                <div className="flex flex-wrap gap-3">
                  <div className="px-3 py-2 rounded-full border border-neutral-900/10 bg-cream/80 text-[12px] tracking-wide text-neutral-900/70">{formatTime(p.createdAt)}</div>
                  <div className="px-3 py-2 rounded-full border border-neutral-900/10 bg-cream/80 text-[12px] tracking-wide text-neutral-900/70">{p.likeCount || 0} likes</div>
                  <div className="px-3 py-2 rounded-full border border-neutral-900/10 bg-cream/80 text-[12px] tracking-wide text-neutral-900/70">{p.commentCount || 0} comments</div>
                </div>
                <div className="mt-3 whitespace-pre-wrap tracking-wide leading-[1.7] text-neutral-900/85">{p.text}</div>
                {p.images && p.images.length > 0 ? (
                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {p.images.map((img) => (
                      <img key={img.url} src={`http://localhost:4000${img.url}`} alt="" className="w-full rounded-2xl" />
                    ))}
                  </div>
                ) : null}
                <div className="mt-6 flex flex-wrap gap-4">
                  <button
                    className="px-6 py-3 rounded-xl border border-olive/60 text-greenDeep text-[14px] tracking-wide hover:bg-olive/10 hover:-translate-y-0.5 transition"
                    type="button"
                    onClick={() => like(p._id)}
                  >
                    Like
                  </button>
                  <button
                    className="px-6 py-3 rounded-xl border border-olive/60 text-greenDeep text-[14px] tracking-wide hover:bg-olive/10 hover:-translate-y-0.5 transition"
                    type="button"
                    onClick={async () => {
                      const next = openPostId === p._id ? '' : p._id;
                      setOpenPostId(next);
                      if (next) await loadComments(next);
                    }}
                  >
                    {openPostId === p._id ? 'Hide discussion' : 'Open discussion'}
                  </button>
                  <button
                    className="px-0 py-3 text-neutral-900/60 text-[14px] tracking-wide hover:underline hover:tracking-wider transition"
                    type="button"
                    onClick={() => removePost(p._id)}
                  >
                    Delete
                  </button>
                </div>

                {openPostId === p._id ? (
                  <div className="mt-8">
                    <div className="text-[13px] uppercase tracking-[0.12em] text-neutral-900/55">Comments</div>
                    <div className="mt-4 space-y-4">
                      {(threadify(commentsByPost[p._id] || [])).map((c) => (
                        <div key={c._id} className="rounded-2xl border border-neutral-900/10 bg-cream/80 p-5">
                          <div className="text-neutral-900/80 tracking-wide leading-[1.7] whitespace-pre-wrap">{c.text}</div>
                          <div className="mt-4 flex flex-wrap gap-4">
                            <button
                              className="px-0 py-2 text-greenDeep text-[13px] tracking-wide hover:underline hover:tracking-wider transition"
                              type="button"
                              onClick={() => setReplyToByPost((s) => ({ ...s, [p._id]: c._id }))}
                            >
                              Reply
                            </button>
                            <button
                              className="px-0 py-2 text-neutral-900/60 text-[13px] tracking-wide hover:underline hover:tracking-wider transition"
                              type="button"
                              onClick={() => removeComment(p._id, c._id)}
                            >
                              Delete
                            </button>
                          </div>
                          {c.replies?.length ? (
                            <div className="mt-4 pl-6 space-y-3">
                              {c.replies.map((r) => (
                                <div key={r._id} className="rounded-2xl border border-neutral-900/10 bg-cream/80 p-4">
                                  <div className="text-neutral-900/75 tracking-wide leading-[1.7] whitespace-pre-wrap">{r.text}</div>
                                  <div className="mt-3 flex flex-wrap gap-4">
                                    <button
                                      className="px-0 py-2 text-neutral-900/60 text-[13px] tracking-wide hover:underline hover:tracking-wider transition"
                                      type="button"
                                      onClick={() => removeComment(p._id, r._id)}
                                    >
                                      Delete
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : null}
                        </div>
                      ))}
                    </div>

                    <div className="mt-8 rounded-2xl border border-neutral-900/10 bg-cream/80 p-5">
                      {replyToByPost[p._id] ? (
                        <div className="text-[13px] tracking-wide text-neutral-900/60">
                          Replying to a comment.{' '}
                          <button
                            className="text-greenDeep hover:underline hover:tracking-wider transition"
                            type="button"
                            onClick={() => setReplyToByPost((s) => ({ ...s, [p._id]: '' }))}
                          >
                            Clear
                          </button>
                        </div>
                      ) : null}
                      <div className="mt-4">
                        <textarea
                          className="w-full min-h-[110px] rounded-xl border border-neutral-900/10 bg-cream/90 px-4 py-3 outline-none focus:border-greenDeep/30 transition resize-y"
                          value={commentDraftByPost[p._id] || ''}
                          onChange={(e) => setCommentDraftByPost((s) => ({ ...s, [p._id]: e.target.value }))}
                          placeholder="Write a comment"
                        />
                      </div>
                      <div className="mt-4 flex gap-4">
                        <button
                          className="px-6 py-3 rounded-xl bg-greenDeep text-cream text-[14px] tracking-wide hover:translate-y-[-2px] hover:shadow-lg transition"
                          type="button"
                          onClick={() => addComment(p._id)}
                        >
                          Post
                        </button>
                        <button
                          className="px-0 py-3 text-neutral-900/60 text-[14px] tracking-wide hover:underline hover:tracking-wider transition"
                          type="button"
                          onClick={() => setCommentDraftByPost((s) => ({ ...s, [p._id]: '' }))}
                        >
                          Clear
                        </button>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

