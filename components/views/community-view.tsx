'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { communityPostDB, commentDB, CommunityPost, Comment } from '@/lib/db';
import { generateCommunityModeration } from '@/lib/ai-service';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Heart, MessageCircle, Plus, Trash2, Loader2 } from 'lucide-react';

export default function CommunityView() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<CommunityPost | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'support' as CommunityPost['category'],
  });
  const [commentText, setCommentText] = useState('');

  const loadPosts = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const data = await communityPostDB.getAll();
      setPosts(data);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadComments = async (postId: string) => {
    try {
      const data = await commentDB.getByPostId(postId);
      setComments(data.sort((a, b) => a.createdAt - b.createdAt));
    } catch (error) {
      console.error('Error loading comments:', error);
    }
  };

  useEffect(() => {
    loadPosts();
  }, [user]);

  useEffect(() => {
    if (selectedPost) {
      loadComments(selectedPost.id);
    }
  }, [selectedPost]);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !formData.title || !formData.content) return;

    setIsSaving(true);
    try {
      // Check moderation
      const moderation = await generateCommunityModeration(formData.content);

      if (!moderation.isAppropriate) {
        alert('Your post violates community guidelines. Please revise and try again.');
        setIsSaving(false);
        return;
      }

      const post: CommunityPost = {
        id: crypto.randomUUID(),
        userId: user.id,
        username: `User${user.id.slice(0, 8)}`,
        title: formData.title,
        content: formData.content,
        category: formData.category,
        likes: 0,
        likedBy: [],
        createdAt: Date.now(),
      };

      await communityPostDB.create(post);
      setFormData({ title: '', content: '', category: 'support' });
      setIsOpen(false);
      await loadPosts();
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedPost || !commentText.trim()) return;

    setIsSaving(true);
    try {
      // Check moderation
      const moderation = await generateCommunityModeration(commentText);

      if (!moderation.isAppropriate) {
        alert('Your comment violates community guidelines.');
        setIsSaving(false);
        return;
      }

      const comment: Comment = {
        id: crypto.randomUUID(),
        postId: selectedPost.id,
        userId: user.id,
        username: `User${user.id.slice(0, 8)}`,
        content: commentText,
        createdAt: Date.now(),
      };

      await commentDB.create(comment);
      setCommentText('');
      await loadComments(selectedPost.id);
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLike = async (post: CommunityPost) => {
    if (!user) return;

    try {
      const isLiked = post.likedBy.includes(user.id);
      const updated: CommunityPost = {
        ...post,
        likes: isLiked ? post.likes - 1 : post.likes + 1,
        likedBy: isLiked
          ? post.likedBy.filter(id => id !== user.id)
          : [...post.likedBy, user.id],
      };

      await communityPostDB.update(updated);
      await loadPosts();
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm('Are you sure?')) return;
    try {
      // In a real app, we'd delete associated comments too
      await communityPostDB.update({
        ...posts.find(p => p.id === postId)!,
      });
      await loadPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const getCategoryColor = (category: CommunityPost['category']) => {
    switch (category) {
      case 'support':
        return 'bg-blue-500/10 text-blue-700';
      case 'discussion':
        return 'bg-purple-500/10 text-purple-700';
      case 'achievement':
        return 'bg-green-500/10 text-green-700';
      case 'resource':
        return 'bg-orange-500/10 text-orange-700';
      default:
        return 'bg-gray-500/10 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Community</h1>
          <p className="text-muted-foreground mt-1">Connect, share, and support each other</p>
        </div>
        <Button onClick={() => setIsOpen(true)} className="gap-2 bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4" />
          New Post
        </Button>
      </div>

      {/* Posts */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : posts.length === 0 ? (
          <Card className="border-dashed border-primary/10">
            <CardContent className="pt-12 pb-12 text-center">
              <MessageCircle className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
              <p className="text-muted-foreground">No posts yet. Be the first to share!</p>
            </CardContent>
          </Card>
        ) : (
          posts.map((post) => (
            <Card
              key={post.id}
              className="border-primary/10 hover:border-primary/20 cursor-pointer transition-colors"
            >
              <CardContent className="pt-6">
                <div className="space-y-3">
                  {/* Header */}
                  <div>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-foreground text-lg">{post.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{post.username}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getCategoryColor(post.category)}`}>
                        {post.category}
                      </span>
                    </div>
                    <p className="text-sm text-foreground mt-2">{post.content}</p>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleLike(post)}
                        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        <Heart
                          className={`w-4 h-4 ${
                            post.likedBy.includes(user?.id || '') ? 'fill-red-500 text-red-500' : ''
                          }`}
                        />
                        {post.likes}
                      </button>
                      <button
                        onClick={() => setSelectedPost(post)}
                        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        <MessageCircle className="w-4 h-4" />
                        {comments.filter(c => c.postId === post.id).length}
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* New Post Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Share with the community</DialogTitle>
            <DialogDescription>
              Be supportive, respectful, and constructive. Our community guidelines apply to all posts.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreatePost} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground block mb-2">Post Title</label>
              <Input
                placeholder="What&apos;s on your mind?"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground block mb-2">Content</label>
              <Textarea
                placeholder="Share your thoughts, experiences, or support others..."
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={6}
                required
                className="resize-none"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground block mb-2">Category</label>
              <div className="grid grid-cols-2 gap-2">
                {(['support', 'discussion', 'achievement', 'resource'] as const).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setFormData({ ...formData, category: cat })}
                    className={`p-2 rounded-lg border-2 transition-all text-sm capitalize ${
                      formData.category === cat
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!formData.title || !formData.content || isSaving}
                className="bg-primary hover:bg-primary/90"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Posting...
                  </>
                ) : (
                  'Post'
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Post Dialog */}
      {selectedPost && (
        <Dialog open={!!selectedPost} onOpenChange={() => setSelectedPost(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedPost.title}</DialogTitle>
              <DialogDescription>{selectedPost.username}</DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* Post Content */}
              <div className="p-4 bg-secondary/20 rounded-lg border border-border">
                <p className="text-foreground">{selectedPost.content}</p>
              </div>

              {/* Comments Section */}
              <div className="space-y-3 max-h-64 overflow-y-auto">
                <h4 className="font-semibold text-foreground">Comments</h4>
                {comments.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No comments yet. Be the first to respond!</p>
                ) : (
                  comments.map((comment) => (
                    <div key={comment.id} className="p-3 rounded-lg bg-secondary/10 border border-border/50">
                      <p className="text-xs font-medium text-primary">{comment.username}</p>
                      <p className="text-sm text-foreground mt-1">{comment.content}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))
                )}
              </div>

              {/* Add Comment */}
              <form onSubmit={handleAddComment} className="space-y-2 border-t border-border pt-4">
                <Textarea
                  placeholder="Share your thoughts..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  rows={3}
                  className="resize-none"
                />
                <Button
                  type="submit"
                  disabled={!commentText.trim() || isSaving}
                  className="bg-primary hover:bg-primary/90"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Posting...
                    </>
                  ) : (
                    'Add Comment'
                  )}
                </Button>
              </form>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
