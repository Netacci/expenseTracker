/* eslint-disable react/prop-types */
import { useEffect, useMemo, useState } from 'react';
import Layout from '../../components/navbar/Layout';
import {
  FileText,
  Plus,
  Trash2,
  Pencil,
  Mail,
  CheckCircle2,
  Download,
  MoreHorizontal,
  ChevronDown,
  ChevronUp,
  Calendar as CalendarIcon,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { Toaster } from 'react-hot-toast';
import { showErrorMessage, showToastMessage } from '@/components/toast/Toast';
import { userRequest } from '@/utils/requestMethods';
import { format } from 'date-fns';

const newLineItem = () => ({
  id: crypto.randomUUID(),
  description: '',
  quantity: 1,
  unitPrice: 0,
});

const emptyForm = () => ({
  name: '',
  billedParty: '',
  billedPartyEmail: '',
  invoiceDate: new Date().toISOString().slice(0, 10),
  currency: 'USD',
  dueDate: '',
  note: '',
  lineItems: [newLineItem()],
});

const CURRENCIES = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'NGN', 'JPY'];

const formatMoney = (value, currency = 'USD') =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(Number(value || 0));

const getLineTotal = (lineItem) =>
  Math.max(0, Number(lineItem.quantity || 0)) * Math.max(0, Number(lineItem.unitPrice || 0));

const getInvoiceTotal = (invoice) =>
  invoice.lineItems.reduce((sum, line) => sum + getLineTotal(line), 0);

const normalizeDateInput = (value) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString().slice(0, 10);
};

const DatePickerField = ({ label, value, onChange, placeholder }) => {
  const selectedDate = value ? new Date(value) : undefined;
  return (
    <div className='space-y-2'>
      <Label>{label}</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant='outline' className='w-full justify-start text-left font-normal'>
            <CalendarIcon className='mr-2 h-4 w-4' />
            {selectedDate ? format(selectedDate, 'PPP') : <span>{placeholder}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-auto p-0' align='start'>
          <Calendar
            mode='single'
            selected={selectedDate}
            onSelect={(date) => onChange(date ? date.toISOString().slice(0, 10) : '')}
            initialFocus
          />
          {value ? (
            <div className='border-t p-2'>
              <Button variant='ghost' className='w-full' onClick={() => onChange('')}>
                Clear date
              </Button>
            </div>
          ) : null}
        </PopoverContent>
      </Popover>
    </div>
  );
};

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [busyInvoiceId, setBusyInvoiceId] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedInvoiceIds, setExpandedInvoiceIds] = useState([]);
  const [openActionsForId, setOpenActionsForId] = useState(null);
  const [paymentDialogInvoice, setPaymentDialogInvoice] = useState(null);
  const [monthlyPlans, setMonthlyPlans] = useState([]);
  const [paymentLinkToIncome, setPaymentLinkToIncome] = useState(false);
  const [selectedMonthlyPlanId, setSelectedMonthlyPlanId] = useState('');

  const isEditing = Boolean(editingId);
  const subtotal = useMemo(
    () => form.lineItems.reduce((sum, line) => sum + getLineTotal(line), 0),
    [form.lineItems]
  );

  const fetchInvoices = async ({ targetPage = 1, append = false } = {}) => {
    try {
      if (append) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
      }
      const response = await userRequest.get('/invoices', {
        params: {
          page: targetPage,
          limit: 10,
          ...(statusFilter !== 'all' ? { status: statusFilter } : {}),
          ...(search.trim() ? { search: search.trim() } : {}),
        },
      });
      const fetchedInvoices = response.data?.data || [];
      const nextHasMore = Boolean(response.data?.pagination?.hasMore);

      setInvoices((prev) => (append ? [...prev, ...fetchedInvoices] : fetchedInvoices));
      setPage(targetPage);
      setHasMore(nextHasMore);
    } catch (error) {
      showErrorMessage(error?.response?.data?.message || 'Could not load invoices.');
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchInvoices({ targetPage: 1, append: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchInvoices({ targetPage: 1, append: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const openCreateModal = () => {
    setEditingId(null);
    setForm(emptyForm());
    setIsModalOpen(true);
  };

  const openEditModal = (invoice) => {
    setEditingId(invoice._id);
    setForm({
      name: invoice.name || '',
      billedParty: invoice.billedParty || '',
      billedPartyEmail: invoice.billedPartyEmail || '',
      invoiceDate: normalizeDateInput(invoice.invoiceDate) || new Date().toISOString().slice(0, 10),
      currency: invoice.currency || 'USD',
      dueDate: normalizeDateInput(invoice.dueDate),
      note: invoice.note || '',
      lineItems:
        invoice.lineItems?.length > 0
          ? invoice.lineItems.map((item) => ({
              id: item._id || item.id || crypto.randomUUID(),
              description: item.description || '',
              quantity: Number(item.quantity || 1),
              unitPrice: Number(item.unitPrice || 0),
            }))
          : [newLineItem()],
    });
    setIsModalOpen(true);
  };

  const updateFormField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const updateLineItem = (id, field, value) => {
    setForm((prev) => ({
      ...prev,
      lineItems: prev.lineItems.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]: field === 'description' ? value : Number(value),
            }
          : item
      ),
    }));
  };

  const addLineItem = () => {
    setForm((prev) => ({ ...prev, lineItems: [...prev.lineItems, newLineItem()] }));
  };

  const removeLineItem = (id) => {
    setForm((prev) => {
      if (prev.lineItems.length === 1) return prev;
      return {
        ...prev,
        lineItems: prev.lineItems.filter((item) => item.id !== id),
      };
    });
  };

  const validateForm = () => {
    if (!form.name.trim()) return 'Invoice name is required.';
    if (!form.billedParty.trim()) return 'Billed party is required.';
    if (!form.billedPartyEmail.trim()) return 'Billed party email is required.';
    if (!form.currency) return 'Currency is required.';
    if (!form.invoiceDate) return 'Invoice date is required.';
    if (!form.lineItems.length) return 'Add at least one line item.';

    const hasIncompleteLine = form.lineItems.some(
      (line) => !line.description.trim() || Number(line.quantity) <= 0 || Number(line.unitPrice) < 0
    );
    if (hasIncompleteLine) {
      return 'Each line item must include description, quantity > 0, and unit price >= 0.';
    }
    return '';
  };

  const handleSaveInvoice = async () => {
    const validationError = validateForm();
    if (validationError) {
      showErrorMessage(validationError);
      return;
    }

    const payload = {
      name: form.name.trim(),
      billedParty: form.billedParty.trim(),
      billedPartyEmail: form.billedPartyEmail.trim(),
      currency: form.currency,
      invoiceDate: form.invoiceDate,
      dueDate: form.dueDate || null,
      note: form.note.trim(),
      lineItems: form.lineItems.map((line) => ({
        description: line.description.trim(),
        quantity: Number(line.quantity),
        unitPrice: Number(line.unitPrice),
      })),
    };

    try {
      setIsSaving(true);
      if (isEditing) {
        await userRequest.put(`/invoices/${editingId}`, payload);
        showToastMessage('Invoice updated.');
      } else {
        await userRequest.post('/invoices/create', payload);
        showToastMessage('Invoice created.');
      }
      setIsModalOpen(false);
      setEditingId(null);
      setForm(emptyForm());
      await fetchInvoices({ targetPage: 1, append: false });
    } catch (error) {
      showErrorMessage(error?.response?.data?.message || 'Could not save invoice.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteInvoice = async (invoice) => {
    try {
      setBusyInvoiceId(invoice._id);
      await userRequest.delete(`/invoices/${invoice._id}`);
      showToastMessage('Invoice deleted.');
      await fetchInvoices({ targetPage: 1, append: false });
    } catch (error) {
      showErrorMessage(error?.response?.data?.message || 'Could not delete invoice.');
    } finally {
      setBusyInvoiceId(null);
    }
  };

  const handleMarkAsPaid = async (invoiceId, paid = true, extras = {}) => {
    try {
      setBusyInvoiceId(invoiceId);
      await userRequest.patch(`/invoices/${invoiceId}/mark-paid`, {
        paid,
        ...extras,
      });
      showToastMessage(paid ? 'Invoice marked as paid.' : 'Invoice marked as unpaid.');
      await fetchInvoices({ targetPage: 1, append: false });
    } catch (error) {
      showErrorMessage(
        error?.response?.data?.message ||
          (paid ? 'Could not mark invoice as paid.' : 'Could not unmark invoice as paid.')
      );
    } finally {
      setBusyInvoiceId(null);
    }
  };

  const handleSendReminder = async (invoice) => {
    try {
      setBusyInvoiceId(invoice._id);
      await userRequest.post(`/invoices/${invoice._id}/send-reminder`);
      showToastMessage(`Reminder sent to ${invoice.billedPartyEmail}.`);
    } catch (error) {
      showErrorMessage(error?.response?.data?.message || 'Could not send reminder.');
    } finally {
      setBusyInvoiceId(null);
    }
  };

  const handleDownloadPdf = async (invoice) => {
    try {
      setBusyInvoiceId(invoice._id);
      const response = await userRequest.get(`/invoices/${invoice._id}/pdf`, {
        responseType: 'blob',
      });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${(invoice.name || 'invoice').replace(/[^a-zA-Z0-9-_]+/g, '-')}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      showToastMessage('Invoice PDF downloaded.');
    } catch (error) {
      showErrorMessage(error?.response?.data?.message || 'Could not download invoice PDF.');
    } finally {
      setBusyInvoiceId(null);
    }
  };

  const toggleInvoiceDetails = (invoiceId) => {
    setExpandedInvoiceIds((prev) =>
      prev.includes(invoiceId) ? prev.filter((id) => id !== invoiceId) : [...prev, invoiceId]
    );
  };

  const openRecordPaymentDialog = async (invoice) => {
    setPaymentDialogInvoice(invoice);
    setPaymentLinkToIncome(false);
    setSelectedMonthlyPlanId('');
    try {
      const response = await userRequest.get('/monthly-plans');
      setMonthlyPlans(response.data?.data || []);
    } catch {
      setMonthlyPlans([]);
    }
  };

  const handleRecordPayment = async () => {
    if (!paymentDialogInvoice) return;
    if (paymentLinkToIncome && !selectedMonthlyPlanId) {
      showErrorMessage('Select a monthly plan to link income.');
      return;
    }
    await handleMarkAsPaid(paymentDialogInvoice._id, true, {
      linkToIncome: paymentLinkToIncome,
      monthlyPlanId: paymentLinkToIncome ? selectedMonthlyPlanId : undefined,
    });
    setPaymentDialogInvoice(null);
  };

  return (
    <Layout>
      <Toaster />
      <div className='max-w-6xl'>
        <div className='flex flex-col gap-4 mb-8 sm:flex-row sm:items-start sm:justify-between'>
          <div className='flex items-start gap-4'>
            <div className='w-12 h-12 rounded-2xl bg-violet-100 flex items-center justify-center flex-shrink-0'>
              <FileText className='h-6 w-6 text-violet-600' />
            </div>
            <div>
              <h1 className='text-2xl font-bold text-slate-900'>Invoices</h1>
              <p className='text-slate-500 text-sm mt-1'>
                Create invoices, manage line items, and follow up on payments.
              </p>
            </div>
          </div>
          <Button onClick={openCreateModal} className='gap-2 self-start'>
            <Plus className='h-4 w-4' />
            Create invoice
          </Button>
        </div>

        <div className='bg-white border border-slate-100 rounded-2xl p-4 mb-6'>
          <div className='grid grid-cols-1 md:grid-cols-[1fr_220px_auto] gap-3'>
            <Input
              placeholder='Search by invoice name, billed party, or email'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  fetchInvoices({ targetPage: 1, append: false });
                }
              }}
            />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder='Filter by status' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All statuses</SelectItem>
                <SelectItem value='draft'>Draft</SelectItem>
                <SelectItem value='sent'>Sent</SelectItem>
                <SelectItem value='paid'>Paid</SelectItem>
              </SelectContent>
            </Select>
            <Button variant='outline' onClick={() => fetchInvoices({ targetPage: 1, append: false })}>
              Search
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className='bg-white rounded-2xl border border-slate-100 p-10 text-center'>
            <Loader2 className='h-8 w-8 animate-spin text-slate-400 mx-auto mb-3' />
            <p className='text-slate-500 text-sm'>Loading invoices...</p>
          </div>
        ) : invoices.length === 0 ? (
          <div className='bg-white rounded-2xl border border-slate-100 border-dashed p-10 text-center'>
            <p className='text-slate-600 font-medium'>No invoices yet.</p>
            <p className='text-slate-400 text-sm mt-2'>
              Create your first invoice to start tracking what is owed.
            </p>
          </div>
        ) : (
          <div className='space-y-4'>
            {invoices.map((invoice) => {
              const total = getInvoiceTotal(invoice);
              const isPaid = invoice.status === 'paid';
              const isSent = invoice.status === 'sent';
              const isDraft = invoice.status === 'draft';
              const hasManyLineItems = invoice.lineItems.length > 3;
              const isExpanded = expandedInvoiceIds.includes(invoice._id);
              const previewItems = invoice.lineItems.slice(0, 3);
              return (
                <div key={invoice._id} className='bg-white rounded-2xl border border-slate-100 p-5'>
                  <div className='flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between'>
                    <div>
                      <p className='text-xs uppercase tracking-wide text-slate-400 mb-1'>{invoice.name}</p>
                      <div className='flex items-center gap-3 flex-wrap'>
                        <h2 className='text-lg font-semibold text-slate-900'>{invoice.billedParty}</h2>
                        <span
                          className={`text-xs font-semibold rounded-full px-2.5 py-1 ${
                            isPaid
                              ? 'bg-emerald-100 text-emerald-700'
                              : isSent
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {isPaid ? 'Paid' : isSent ? 'Sent' : 'Draft'}
                        </span>
                      </div>
                      <p className='text-sm text-slate-500 mt-1'>{invoice.billedPartyEmail}</p>
                      <p className='text-sm text-slate-500 mt-1'>
                        Invoice date: {normalizeDateInput(invoice.invoiceDate)}
                        {invoice.dueDate
                          ? ` | Due: ${normalizeDateInput(invoice.dueDate)}`
                          : ' | No due date'}
                      </p>
                      {invoice.note ? (
                        <p className='text-sm text-slate-600 mt-3 bg-slate-50 rounded-lg p-3'>{invoice.note}</p>
                      ) : null}
                    </div>
                    <div className='text-left lg:text-right'>
                      <p className='text-xs uppercase tracking-wide text-slate-400'>Total</p>
                      <p className='text-xl font-bold text-slate-900'>
                        {formatMoney(total, invoice.currency)}
                      </p>
                    </div>
                  </div>

                  <div className='mt-4'>
                    {hasManyLineItems && !isExpanded ? (
                      <div className='text-sm text-slate-600 bg-slate-50 rounded-lg px-3 py-2'>
                        {previewItems.map((line) => line.description).join(', ')}
                        {invoice.lineItems.length > previewItems.length
                          ? ` +${invoice.lineItems.length - previewItems.length} more item(s)`
                          : ''}
                      </div>
                    ) : (
                      <div className='overflow-x-auto'>
                        <table className='min-w-full text-sm'>
                          <thead>
                            <tr className='text-slate-500 border-b'>
                              <th className='text-left py-2 font-medium'>Line item</th>
                              <th className='text-right py-2 font-medium'>Qty</th>
                              <th className='text-right py-2 font-medium'>Unit price</th>
                              <th className='text-right py-2 font-medium'>Amount</th>
                            </tr>
                          </thead>
                          <tbody>
                            {invoice.lineItems.map((line) => (
                              <tr key={line._id || line.id} className='border-b last:border-0'>
                                <td className='py-2 text-slate-700'>{line.description}</td>
                                <td className='py-2 text-right text-slate-700'>{line.quantity}</td>
                                <td className='py-2 text-right text-slate-700'>
                                  {formatMoney(line.unitPrice, invoice.currency)}
                                </td>
                                <td className='py-2 text-right text-slate-900 font-medium'>
                                  {formatMoney(getLineTotal(line), invoice.currency)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                    {hasManyLineItems ? (
                      <Button
                        variant='ghost'
                        className='mt-2 px-0 text-slate-600 hover:text-slate-900'
                        onClick={() => toggleInvoiceDetails(invoice._id)}
                      >
                        {isExpanded ? (
                          <>
                            <ChevronUp className='h-4 w-4 mr-1' />
                            Hide details
                          </>
                        ) : (
                          <>
                            <ChevronDown className='h-4 w-4 mr-1' />
                            View details
                          </>
                        )}
                      </Button>
                    ) : null}
                  </div>

                  <div className='flex flex-wrap gap-2 mt-5'>
                    {isDraft ? (
                      <Button
                        className='gap-2'
                        onClick={() =>
                          setConfirmAction({
                            type: 'send',
                            invoice,
                            title: 'Send invoice?',
                            description: `This will email "${invoice.name}" to ${invoice.billedPartyEmail} and mark it as sent.`,
                            confirmText: 'Send invoice',
                          })
                        }
                        disabled={busyInvoiceId === invoice._id}
                      >
                        <Mail className='h-4 w-4' />
                        Send invoice
                      </Button>
                    ) : !isPaid ? (
                      <Button
                        className='gap-2'
                        onClick={() => openRecordPaymentDialog(invoice)}
                        disabled={busyInvoiceId === invoice._id}
                      >
                        <CheckCircle2 className='h-4 w-4' />
                        Record payment
                      </Button>
                    ) : (
                      <Button
                        className='gap-2'
                        onClick={() =>
                          setConfirmAction({
                            type: 'unmark-paid',
                            invoice,
                            title: 'Unmark invoice as paid?',
                            description: `This will remove paid status from "${invoice.name}".`,
                            confirmText: 'Unmark as paid',
                          })
                        }
                        disabled={busyInvoiceId === invoice._id}
                      >
                        <CheckCircle2 className='h-4 w-4' />
                        Unmark as paid
                      </Button>
                    )}
                    <div className='relative'>
                      <Button
                        variant='outline'
                        className='gap-2'
                        onClick={() =>
                          setOpenActionsForId((prev) => (prev === invoice._id ? null : invoice._id))
                        }
                      >
                        <MoreHorizontal className='h-4 w-4' />
                        More actions
                      </Button>
                      {openActionsForId === invoice._id ? (
                        <div className='absolute right-0 mt-2 z-10 w-52 rounded-lg border border-slate-200 bg-white shadow-md p-1'>
                          <Button
                            variant='ghost'
                            className='w-full justify-start'
                            onClick={() => {
                              setOpenActionsForId(null);
                              openEditModal(invoice);
                            }}
                          >
                            <Pencil className='h-4 w-4 mr-2' />
                            Edit
                          </Button>
                          <Button
                            variant='ghost'
                            className='w-full justify-start'
                            onClick={() => {
                              setOpenActionsForId(null);
                              handleDownloadPdf(invoice);
                            }}
                          >
                            <Download className='h-4 w-4 mr-2' />
                            Download PDF
                          </Button>
                          {!isDraft ? (
                            <Button
                              variant='ghost'
                              className='w-full justify-start'
                              onClick={() => {
                                setOpenActionsForId(null);
                                setConfirmAction({
                                  type: 'send-reminder',
                                  invoice,
                                  title: 'Send reminder?',
                                  description: `This will send a reminder email for "${invoice.name}" to ${invoice.billedPartyEmail}.`,
                                  confirmText: 'Send reminder',
                                });
                              }}
                            >
                              <Mail className='h-4 w-4 mr-2' />
                              Send reminder
                            </Button>
                          ) : null}
                          <Button
                            variant='ghost'
                            className='w-full justify-start text-red-600 hover:text-red-700'
                            onClick={() => {
                              setOpenActionsForId(null);
                              setConfirmAction({
                                type: 'delete',
                                invoice,
                                title: 'Delete invoice?',
                                description: `This will permanently delete "${invoice.name}".`,
                                confirmText: 'Delete',
                              });
                            }}
                          >
                            <Trash2 className='h-4 w-4 mr-2' />
                            Delete
                          </Button>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              );
            })}
            {hasMore ? (
              <div className='flex justify-center pt-2'>
                <Button
                  variant='outline'
                  onClick={() => fetchInvoices({ targetPage: page + 1, append: true })}
                  disabled={isLoadingMore}
                  className='gap-2'
                >
                  {isLoadingMore ? <Loader2 className='h-4 w-4 animate-spin' /> : null}
                  Load more
                </Button>
              </div>
            ) : null}
          </div>
        )}
      </div>

      <Dialog
        open={isModalOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsModalOpen(false);
            setEditingId(null);
            setForm(emptyForm());
          }
        }}
      >
        <DialogContent className='max-h-[90vh] max-w-3xl overflow-y-auto'>
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit invoice' : 'Create invoice'}</DialogTitle>
            <DialogDescription>
              Add billed party details, dates, note, and line items for this invoice.
            </DialogDescription>
          </DialogHeader>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label htmlFor='name'>Invoice name</Label>
              <Input
                id='name'
                value={form.name}
                onChange={(e) => updateFormField('name', e.target.value)}
                placeholder='e.g. Website design - April'
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='currency'>Currency</Label>
              <Select value={form.currency} onValueChange={(value) => updateFormField('currency', value)}>
                <SelectTrigger>
                  <SelectValue placeholder='Select currency' />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map((currency) => (
                    <SelectItem key={currency} value={currency}>
                      {currency}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <DatePickerField
              label='Invoice date'
              value={form.invoiceDate}
              onChange={(value) => updateFormField('invoiceDate', value)}
              placeholder='Pick invoice date'
            />
            <DatePickerField
              label='Due date (optional)'
              value={form.dueDate}
              onChange={(value) => updateFormField('dueDate', value)}
              placeholder='Pick due date'
            />
            <div className='space-y-2'>
              <Label htmlFor='billedParty'>Billed party</Label>
              <Input
                id='billedParty'
                value={form.billedParty}
                onChange={(e) => updateFormField('billedParty', e.target.value)}
                placeholder='e.g. Acme Inc.'
              />
            </div>
            <div className='space-y-2 md:col-span-2'>
              <Label htmlFor='billedPartyEmail'>Billed party email</Label>
              <Input
                id='billedPartyEmail'
                type='email'
                value={form.billedPartyEmail}
                onChange={(e) => updateFormField('billedPartyEmail', e.target.value)}
                placeholder='billing@acme.com'
              />
            </div>
          </div>

          <div className='space-y-2 mt-2'>
            <Label htmlFor='note'>Note (optional)</Label>
            <Textarea
              id='note'
              value={form.note}
              onChange={(e) => updateFormField('note', e.target.value)}
              placeholder='Add any notes for this invoice'
            />
          </div>

          <div className='space-y-3 mt-2'>
            <div className='flex items-center justify-between'>
              <h3 className='font-semibold text-slate-900'>Line items</h3>
              <Button variant='outline' className='gap-2' onClick={addLineItem}>
                <Plus className='h-4 w-4' />
                Add line item
              </Button>
            </div>

            {form.lineItems.map((lineItem) => (
              <div
                key={lineItem.id}
                className='grid grid-cols-1 md:grid-cols-[1fr_120px_140px_auto] gap-3 border border-slate-200 rounded-xl p-3'
              >
                <div className='space-y-2'>
                  <Label>Description</Label>
                  <Input
                    value={lineItem.description}
                    onChange={(e) => updateLineItem(lineItem.id, 'description', e.target.value)}
                    placeholder='e.g. Website design'
                  />
                </div>
                <div className='space-y-2'>
                  <Label>Quantity</Label>
                  <Input
                    type='number'
                    min='1'
                    step='1'
                    value={lineItem.quantity}
                    onChange={(e) => updateLineItem(lineItem.id, 'quantity', e.target.value)}
                  />
                </div>
                <div className='space-y-2'>
                  <Label>Unit price</Label>
                  <Input
                    type='number'
                    min='0'
                    step='0.01'
                    value={lineItem.unitPrice}
                    onChange={(e) => updateLineItem(lineItem.id, 'unitPrice', e.target.value)}
                  />
                </div>
                <div className='flex items-end justify-end'>
                  <Button
                    variant='outline'
                    className='text-red-600 border-red-200 hover:bg-red-50'
                    disabled={form.lineItems.length === 1}
                    onClick={() => removeLineItem(lineItem.id)}
                  >
                    <Trash2 className='h-4 w-4' />
                  </Button>
                </div>
              </div>
            ))}

            <div className='bg-slate-50 rounded-xl p-3 flex items-center justify-between'>
              <p className='text-sm text-slate-500'>Subtotal</p>
              <p className='font-semibold text-slate-900'>{formatMoney(subtotal, form.currency)}</p>
            </div>
          </div>

          <DialogFooter>
            <Button variant='outline' onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveInvoice} disabled={isSaving}>
              {isSaving ? <Loader2 className='h-4 w-4 animate-spin' /> : isEditing ? 'Save changes' : 'Create invoice'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={Boolean(confirmAction)}
        onOpenChange={(open) => {
          if (!open) setConfirmAction(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{confirmAction?.title}</AlertDialogTitle>
            <AlertDialogDescription>{confirmAction?.description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                const action = confirmAction;
                setConfirmAction(null);
                if (!action?.invoice) return;

                try {
                  if (action.type === 'delete') {
                    await handleDeleteInvoice(action.invoice);
                    return;
                  }

                  if (action.type === 'mark-paid') {
                    await handleMarkAsPaid(action.invoice._id, true);
                    return;
                  }

                  if (action.type === 'unmark-paid') {
                    await handleMarkAsPaid(action.invoice._id, false);
                    return;
                  }

                  if (action.type === 'send') {
                    setBusyInvoiceId(action.invoice._id);
                    await userRequest.post(`/invoices/${action.invoice._id}/send`);
                    showToastMessage(`Invoice sent to ${action.invoice.billedPartyEmail}.`);
                    await fetchInvoices({ targetPage: 1, append: false });
                    return;
                  }

                  if (action.type === 'send-reminder') {
                    await handleSendReminder(action.invoice);
                  }
                } finally {
                  setBusyInvoiceId(null);
                }
              }}
            >
              {confirmAction?.confirmText || 'Confirm'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog
        open={Boolean(paymentDialogInvoice)}
        onOpenChange={(open) => {
          if (!open) setPaymentDialogInvoice(null);
        }}
      >
        <DialogContent className='max-w-lg'>
          <DialogHeader>
            <DialogTitle>Record payment</DialogTitle>
            <DialogDescription>
              Mark this invoice as paid and optionally link payment to a monthly plan income.
            </DialogDescription>
          </DialogHeader>
          <div className='space-y-4'>
            <label className='flex items-center gap-2 text-sm text-slate-700'>
              <input
                type='checkbox'
                checked={paymentLinkToIncome}
                onChange={(e) => setPaymentLinkToIncome(e.target.checked)}
              />
              Link this payment to budget income
            </label>
            {paymentLinkToIncome ? (
              <div className='space-y-2'>
                <Label>Monthly plan</Label>
                <Select value={selectedMonthlyPlanId} onValueChange={setSelectedMonthlyPlanId}>
                  <SelectTrigger>
                    <SelectValue placeholder='Select monthly plan' />
                  </SelectTrigger>
                  <SelectContent>
                    {monthlyPlans.map((plan) => (
                      <SelectItem key={plan._id} value={plan._id}>
                        {plan.name} ({plan.month}/{plan.year})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : null}
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={() => setPaymentDialogInvoice(null)}>
              Cancel
            </Button>
            <Button onClick={handleRecordPayment} disabled={busyInvoiceId === paymentDialogInvoice?._id}>
              Confirm payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Invoices;
