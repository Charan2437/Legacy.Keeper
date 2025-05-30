"use client"

import { X, Calendar, DollarSign, CreditCard, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { format, parseISO } from "date-fns"
import type { Tables } from "@/lib/supabase/database.types"
import { Badge } from "@/components/ui/badge"

interface DebtLoanDetailsModalProps {
  debtLoan: Tables<"debts_loans">
  isOpen: boolean
  onClose: () => void
}

export function DebtLoanDetailsModal({ debtLoan, isOpen, onClose }: DebtLoanDetailsModalProps) {
  const handleDownloadAttachment = () => {
    if (debtLoan.attachment_url) {
      window.open(debtLoan.attachment_url, "_blank")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto p-0 sm:rounded-lg">
        <DialogHeader className="sticky top-0 z-10 border-b bg-white px-6 py-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl">Debt/Loan Details</DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
        </DialogHeader>

        <div className="p-6">
          <div className="mb-6 rounded-lg bg-gray-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">{debtLoan.person}</h3>
                <p className="text-sm text-gray-500">{format(parseISO(debtLoan.start_date), "MMMM d, yyyy")}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  className={`${
                    debtLoan.transaction_type === "Given" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
                  }`}
                >
                  {debtLoan.transaction_type}
                </Badge>
                <Badge
                  className={`${
                    debtLoan.status === "Active"
                      ? "bg-yellow-100 text-yellow-800"
                      : debtLoan.status === "Completed"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                  }`}
                >
                  {debtLoan.status}
                </Badge>
              </div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="space-y-1">
                <h4 className="text-sm font-medium text-gray-500">Amount</h4>
                <div className="flex items-center">
                  <DollarSign className="mr-2 h-5 w-5 text-gray-400" />
                  <p className="text-lg font-medium">₹{Number(debtLoan.amount).toLocaleString()}</p>
                </div>
              </div>

              <div className="space-y-1">
                <h4 className="text-sm font-medium text-gray-500">Interest</h4>
                <div className="flex items-center">
                  <DollarSign className="mr-2 h-5 w-5 text-gray-400" />
                  <p>{debtLoan.interest ? `₹${Number(debtLoan.interest).toLocaleString()}` : "N/A"}</p>
                </div>
              </div>

              <div className="space-y-1">
                <h4 className="text-sm font-medium text-gray-500">Amount Due</h4>
                <div className="flex items-center">
                  <DollarSign className="mr-2 h-5 w-5 text-gray-400" />
                  <p>{debtLoan.amount_due ? `₹${Number(debtLoan.amount_due).toLocaleString()}` : "N/A"}</p>
                </div>
              </div>

              <div className="space-y-1">
                <h4 className="text-sm font-medium text-gray-500">Payment Mode</h4>
                <div className="flex items-center">
                  <CreditCard className="mr-2 h-5 w-5 text-gray-400" />
                  <p>{debtLoan.payment_mode || "N/A"}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <h4 className="text-sm font-medium text-gray-500">Start Date</h4>
                <div className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5 text-gray-400" />
                  <p>{format(parseISO(debtLoan.start_date), "PPP")}</p>
                </div>
              </div>

              <div className="space-y-1">
                <h4 className="text-sm font-medium text-gray-500">Security</h4>
                <p className="rounded-md bg-gray-50 p-3 text-sm">{debtLoan.security || "No security provided"}</p>
              </div>

              <div className="space-y-1">
                <h4 className="text-sm font-medium text-gray-500">Purpose/Description</h4>
                <p className="rounded-md bg-gray-50 p-3 text-sm">{debtLoan.purpose || "No description provided"}</p>
              </div>

              {debtLoan.attachment_url && (
                <div className="space-y-1">
                  <h4 className="text-sm font-medium text-gray-500">Attachment</h4>
                  <div className="flex items-center justify-between rounded-md border p-3">
                    <div className="flex items-center">
                      <FileText className="mr-2 h-5 w-5 text-blue-500" />
                      <span className="text-sm">Attachment</span>
                    </div>
                    <Button variant="outline" size="sm" className="text-blue-600" onClick={handleDownloadAttachment}>
                      View
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 border-t pt-6">
            <div className="flex justify-between text-sm">
              <div>
                <p className="text-gray-500">Created</p>
                <p>{format(parseISO(debtLoan.created_at), "PPP")}</p>
              </div>
              <div className="text-right">
                <p className="text-gray-500">Last Updated</p>
                <p>{format(parseISO(debtLoan.updated_at), "PPP")}</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
