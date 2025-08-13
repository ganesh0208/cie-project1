"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { BookOpen, Search, ChevronLeft, ChevronRight } from "lucide-react"
import { useState } from "react"

interface Note {
  id: number
  title: string
  content: string
  order_index: number
}

interface CourseNotesProps {
  notes: Note[]
}

export function CourseNotes({ notes }: CourseNotesProps) {
  const [selectedNote, setSelectedNote] = useState<Note | null>(notes[0] || null)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const currentIndex = selectedNote ? filteredNotes.findIndex((note) => note.id === selectedNote.id) : 0
  const canGoPrevious = currentIndex > 0
  const canGoNext = currentIndex < filteredNotes.length - 1

  const goToPrevious = () => {
    if (canGoPrevious) {
      setSelectedNote(filteredNotes[currentIndex - 1])
    }
  }

  const goToNext = () => {
    if (canGoNext) {
      setSelectedNote(filteredNotes[currentIndex + 1])
    }
  }

  if (notes.length === 0) {
    return (
      <div className="text-center py-12">
        <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold mb-2">No notes available</h3>
        <p className="text-muted-foreground">Course notes are being prepared. Check back soon!</p>
      </div>
    )
  }

  return (
    <div className="grid lg:grid-cols-4 gap-6">
      {/* Notes Navigation */}
      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Course Contents</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {filteredNotes.map((note, index) => (
              <button
                key={note.id}
                onClick={() => setSelectedNote(note)}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  selectedNote?.id === note.id ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs">
                    {notes.findIndex((n) => n.id === note.id) + 1}
                  </Badge>
                  <span className="text-sm font-medium">{note.title}</span>
                </div>
              </button>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Note Content */}
      <div className="lg:col-span-3">
        {selectedNote && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl">{selectedNote.title}</CardTitle>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={goToPrevious} disabled={!canGoPrevious}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    {currentIndex + 1} of {filteredNotes.length}
                  </span>
                  <Button variant="outline" size="sm" onClick={goToNext} disabled={!canGoNext}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div
                className="prose prose-slate max-w-none dark:prose-invert prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-code:text-foreground"
                dangerouslySetInnerHTML={{
                  __html: selectedNote.content
                    .replace(/\n/g, "<br>")
                    .replace(
                      /```(\w+)?\n([\s\S]*?)```/g,
                      '<pre class="bg-muted p-4 rounded-lg overflow-x-auto border"><code class="text-sm">$2</code></pre>',
                    )
                    .replace(/`([^`]+)`/g, '<code class="bg-muted px-2 py-1 rounded text-sm font-mono">$1</code>')
                    .replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold mb-4 mt-6">$1</h1>')
                    .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-semibold mb-3 mt-6">$1</h2>')
                    .replace(/^### (.*$)/gm, '<h3 class="text-xl font-semibold mb-2 mt-4">$1</h3>')
                    .replace(/^\* (.*$)/gm, '<li class="ml-4 mb-1">$1</li>')
                    .replace(/^- (.*$)/gm, '<li class="ml-4 mb-1">$1</li>')
                    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                    .replace(/\*(.*?)\*/g, "<em>$1</em>"),
                }}
              />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
