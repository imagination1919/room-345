import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Gift } from "@medusajs/icons"
import {
  Button,
  Container,
  Heading,
  StatusBadge,
  Table,
  Text,
  toast,
} from "@medusajs/ui"
import { useEffect, useState } from "react"

type Affiliate = {
  id: string
  customer_id: string
  display_name: string
  referral_code: string
  status: "pending" | "approved" | "rejected" | "suspended"
  tier: string
  commission_rate: number
  applied_at: string
}

const statusColor: Record<Affiliate["status"], "orange" | "green" | "red" | "grey"> = {
  pending: "orange",
  approved: "green",
  rejected: "red",
  suspended: "grey",
}

const AffiliatesPage = () => {
  const [affiliates, setAffiliates] = useState<Affiliate[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [actioningId, setActioningId] = useState<string | null>(null)

  const loadAffiliates = async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/admin/affiliates?status=pending", {
        credentials: "include",
      })
      const data = await res.json()
      setAffiliates(data.affiliates ?? [])
    } catch {
      toast.error("Could not load affiliate applications")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadAffiliates()
  }, [])

  const handleAction = async (id: string, action: "approve" | "reject") => {
    setActioningId(id)
    try {
      const res = await fetch(`/admin/affiliates/${id}/${action}`, {
        method: "POST",
        credentials: "include",
      })
      if (!res.ok) {
        throw new Error(`Failed to ${action} affiliate`)
      }
      toast.success(`Application ${action}d`)
      setAffiliates((prev) => prev.filter((a) => a.id !== id))
    } catch {
      toast.error(`Could not ${action} this application`)
    } finally {
      setActioningId(null)
    }
  }

  return (
    <Container className="p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <Heading level="h1">Affiliate applications</Heading>
          <Text className="text-ui-fg-subtle">
            Pending applications awaiting manual review.
          </Text>
        </div>
      </div>
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Display name</Table.HeaderCell>
            <Table.HeaderCell>Referral code</Table.HeaderCell>
            <Table.HeaderCell>Status</Table.HeaderCell>
            <Table.HeaderCell>Applied</Table.HeaderCell>
            <Table.HeaderCell>Actions</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {affiliates.map((affiliate) => (
            <Table.Row key={affiliate.id}>
              <Table.Cell>{affiliate.display_name}</Table.Cell>
              <Table.Cell>{affiliate.referral_code}</Table.Cell>
              <Table.Cell>
                <StatusBadge color={statusColor[affiliate.status]}>
                  {affiliate.status}
                </StatusBadge>
              </Table.Cell>
              <Table.Cell>
                {new Date(affiliate.applied_at).toLocaleDateString()}
              </Table.Cell>
              <Table.Cell>
                <div className="flex gap-x-2">
                  <Button
                    size="small"
                    variant="secondary"
                    isLoading={actioningId === affiliate.id}
                    onClick={() => handleAction(affiliate.id, "approve")}
                  >
                    Approve
                  </Button>
                  <Button
                    size="small"
                    variant="danger"
                    isLoading={actioningId === affiliate.id}
                    onClick={() => handleAction(affiliate.id, "reject")}
                  >
                    Reject
                  </Button>
                </div>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      {!isLoading && affiliates.length === 0 && (
        <div className="px-6 py-8">
          <Text className="text-ui-fg-subtle">
            No pending affiliate applications.
          </Text>
        </div>
      )}
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Affiliates",
  icon: Gift,
})

export default AffiliatesPage
