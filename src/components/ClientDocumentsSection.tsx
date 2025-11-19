import { useState } from 'react';
import { ClientDocument, DocumentStatus, DocumentType } from '@/types/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Download, Edit, Trash2, FileText, Clock, CheckCircle, AlertCircle, File } from 'lucide-react';
import { AddDocumentDialog } from './AddDocumentDialog';
import { EditDocumentDialog } from './EditDocumentDialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ClientDocumentsSectionProps {
  documents: ClientDocument[];
  onAddDocument: (document: Omit<ClientDocument, 'id' | 'uploadedDate' | 'uploadedBy'>) => void;
  onUpdateDocument: (documentId: string, updates: Partial<ClientDocument>) => void;
  onDeleteDocument: (documentId: string) => void;
}

export function ClientDocumentsSection({
  documents,
  onAddDocument,
  onUpdateDocument,
  onDeleteDocument,
}: ClientDocumentsSectionProps) {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingDocument, setEditingDocument] = useState<ClientDocument | null>(null);
  const [deletingDocumentId, setDeletingDocumentId] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredDocuments = documents.filter(doc => {
    if (typeFilter !== 'all' && doc.type !== typeFilter) return false;
    if (statusFilter !== 'all' && doc.status !== statusFilter) return false;
    return true;
  });

  const sortedDocuments = [...filteredDocuments].sort((a, b) => {
    return new Date(b.uploadedDate).getTime() - new Date(a.uploadedDate).getTime();
  });

  const getStatusIcon = (status: DocumentStatus) => {
    switch (status) {
      case 'signed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'expired':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'draft':
        return <File className="h-4 w-4 text-muted-foreground" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusBadgeVariant = (status: DocumentStatus): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'signed':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'expired':
        return 'destructive';
      case 'draft':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const getTypeBadgeVariant = (type: DocumentType): "default" | "secondary" | "outline" => {
    switch (type) {
      case 'msa':
      case 'commission':
        return 'default';
      case 'nda':
      case 'compliance':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const handleDownload = (document: ClientDocument) => {
    if (!document.url) return;
    
    const link = window.document.createElement('a');
    link.href = document.url;
    link.download = document.name;
    window.document.body.appendChild(link);
    link.click();
    window.document.body.removeChild(link);
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="flex items-center gap-2">
            Documents
            {documents.length > 0 && (
              <Badge variant="secondary">{documents.length}</Badge>
            )}
          </CardTitle>
          <Button onClick={() => setShowAddDialog(true)} size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Document
          </Button>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          {documents.length > 0 && (
            <div className="flex gap-2 mb-4">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="msa">MSA</SelectItem>
                  <SelectItem value="nda">NDA</SelectItem>
                  <SelectItem value="commission">Commission</SelectItem>
                  <SelectItem value="compliance">Compliance</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="signed">Signed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {documents.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No documents yet. Upload your first document to get started.</p>
            </div>
          ) : sortedDocuments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No documents match the selected filters.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sortedDocuments.map(document => (
                <Card key={document.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {getStatusIcon(document.status)}
                          <h4 className="font-semibold text-foreground">{document.name}</h4>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-3">
                          <Badge variant={getTypeBadgeVariant(document.type)}>
                            {document.type.toUpperCase()}
                          </Badge>
                          <Badge variant={getStatusBadgeVariant(document.status)}>
                            {document.status}
                          </Badge>
                        </div>
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <p>Uploaded: {new Date(document.uploadedDate).toLocaleDateString()} by {document.uploadedBy}</p>
                          {document.signedBy && document.signedDate && (
                            <p>Signed by {document.signedBy} on {new Date(document.signedDate).toLocaleDateString()}</p>
                          )}
                          {document.expiryDate && (
                            <p className={new Date(document.expiryDate) < new Date() ? 'text-red-500' : ''}>
                              Expires: {new Date(document.expiryDate).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {document.url && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDownload(document)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setEditingDocument(document)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeletingDocumentId(document.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <AddDocumentDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onAdd={onAddDocument}
      />

      {editingDocument && (
        <EditDocumentDialog
          open={true}
          onOpenChange={(open) => !open && setEditingDocument(null)}
          document={editingDocument}
          onUpdate={(updates) => {
            onUpdateDocument(editingDocument.id, updates);
            setEditingDocument(null);
          }}
        />
      )}

      <AlertDialog open={!!deletingDocumentId} onOpenChange={(open) => !open && setDeletingDocumentId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Document</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this document? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deletingDocumentId) {
                  onDeleteDocument(deletingDocumentId);
                  setDeletingDocumentId(null);
                }
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
