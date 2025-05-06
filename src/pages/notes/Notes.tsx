import { useEffect, useState } from 'react';
import axios from 'axios';
import Card from '../../components/common/Card';
import EmptyState from '../../components/common/EmptyState';
import { FileText, Trash2, Plus } from 'lucide-react';
import { Dialog } from '@headlessui/react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { API_URL } from '../../config/constants';

interface Note {
  id: number;
  content: string;
  created_at: string;
}

const Notes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const editor = useEditor({
    extensions: [StarterKit],
    content: '',
  });

  const fetchNotes = async () => {
    try {
      const res = await axios.get(`${API_URL}/notes`);
      setNotes(res.data);
    } catch (err) {
      console.error('Failed to fetch notes', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!editor || !editor.getHTML().trim()) return;
    setSubmitting(true);
    try {
      await axios.post(`${API_URL}/notes`, { content: editor.getHTML() });
      editor.commands.setContent('');
      setShowModal(false);
      fetchNotes();
    } catch (err) {
      console.error('Failed to create note', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this note?')) return;
    try {
      await axios.delete(`${API_URL}/notes/${id}`);
      fetchNotes();
    } catch (err) {
      console.error('Failed to delete note', err);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Notes</h1>
        <button onClick={() => setShowModal(true)} className="btn btn-primary flex items-center">
          <Plus className="w-4 h-4 mr-1" />
          Create Note
        </button>
      </div>

      {notes.length === 0 && !loading ? (
        <Card>
          <EmptyState
            icon={<FileText className="w-12 h-12 text-gray-400" />}
            title="No notes yet"
            description="Create your first note to get started"
            actionLabel="Create Note"
            onAction={() => setShowModal(true)}
          />
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {notes.map(note => (
            <Card
              key={note.id}
              className="relative"
              footer={
                <button
                  onClick={() => handleDelete(note.id)}
                  className="text-sm text-red-600 hover:underline flex items-center"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </button>
              }
            >
              <div
                className="text-sm text-gray-700 dark:text-gray-200 prose dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: note.content }}
              />
              <p className="mt-2 text-xs text-gray-400">{new Date(note.created_at).toLocaleString()}</p>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={showModal} onClose={() => setShowModal(false)} className="fixed z-50 inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen p-4">
          <Dialog.Panel className="w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded shadow-lg space-y-4">
            <Dialog.Title className="text-lg font-semibold text-gray-900 dark:text-white">
              Create Note
            </Dialog.Title>
            {editor && (
              <div className="rounded border dark:border-gray-600 bg-white dark:bg-gray-700 p-2">
                <EditorContent editor={editor} className="prose dark:prose-invert max-w-none min-h-[120px]" />
              </div>
            )}
            <div className="flex justify-end space-x-2">
              <button onClick={() => setShowModal(false)} className="btn btn-outline">Cancel</button>
              <button onClick={handleCreate} className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Saving...' : 'Save Note'}
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default Notes;
