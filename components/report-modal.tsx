"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Flag } from "lucide-react"

interface ReportModalProps {
  isOpen: boolean
  onClose: () => void
  type: "post" | "comment"
  targetId: string | number
  targetTitle?: string
}

const reportReasons = [
  "Inappropriate language not filtered",
  "Hate speech",
  "Sexual or explicit content",
  "Spam/Advertisement",
  "Other",
]

export function ReportModal({ isOpen, onClose, type, targetId, targetTitle }: ReportModalProps) {
  const [selectedReason, setSelectedReason] = useState("")
  const [customReason, setCustomReason] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async () => {
    if (!selectedReason) {
      toast({
        description: "Please select a reason for reporting",
        variant: "destructive",
      })
      return
    }

    if (selectedReason === "Other" && !customReason.trim()) {
      toast({
        description: "Please provide details for your report",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      toast({
        description: `${type === "post" ? "Post" : "Comment"} has been reported successfully. Our team will review it.`,
      })
      setIsSubmitting(false)
      onClose()
      // Reset form
      setSelectedReason("")
      setCustomReason("")
    }, 1000)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Flag className="h-5 w-5 text-red-500" />
            <span>Report {type === "post" ? "Post" : "Comment"}</span>
          </DialogTitle>
          {targetTitle && <p className="text-sm text-gray-600 mt-2">"{targetTitle}"</p>}
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div>
            <Label className="text-sm font-medium">Why are you reporting this {type}?</Label>
            <RadioGroup value={selectedReason} onValueChange={setSelectedReason} className="mt-2">
              {reportReasons.map((reason) => (
                <div key={reason} className="flex items-center space-x-2">
                  <RadioGroupItem value={reason} id={reason} />
                  <Label htmlFor={reason} className="text-sm cursor-pointer">
                    {reason}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {selectedReason === "Other" && (
            <div className="space-y-2">
              <Label htmlFor="custom-reason" className="text-sm font-medium">
                Please provide details
              </Label>
              <Textarea
                id="custom-reason"
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="Describe the issue..."
                className="min-h-[80px]"
                maxLength={500}
              />
              <p className="text-xs text-gray-500">{500 - customReason.length} characters remaining</p>
            </div>
          )}

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <p className="text-xs text-amber-800">
              <strong>Note:</strong> False reports may result in restrictions on your account. Reports are reviewed by
              our moderation team within 24 hours.
            </p>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !selectedReason}
              className="flex-1 bg-red-600 hover:bg-red-700"
            >
              {isSubmitting ? "Submitting..." : "Submit Report"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
