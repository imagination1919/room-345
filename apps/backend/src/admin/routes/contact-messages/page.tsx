import { defineRouteConfig } from "@medusajs/admin-sdk"
import { EnvelopeSolid } from "@medusajs/icons"
import { Badge, Button, Container, Heading, Table, Text, toast } from "@medusajs/ui"
import { useEffect, useState } from "react"

type ContactMessage = {
  id: string
  name: string
  email: string
  phone: string | null
  message: string
  read_at: string | null
  created_at: string
}

const ContactMessagesPage = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [actioningId, setActioningId] = useState<string | null>(null)

  const loadMessages = async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/admin/contact-messages", {
        credentials: "include",
      })
      const data = await res.json()
      setMessages(data.contact_messages ?? [])
    } catch {
      toast.error("Could not load contact messages")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadMessages()
  }, [])

  const handleMarkRead = async (id: string) => {
    setActioningId(id)
    try {
      const res = await fetch(`/admin/contact-messages/${id}/read`, {
        method: "POST",
        credentials: "include",
      })
      if (!res.ok) {
        throw new Error("Failed to mark as read")
      }
      const now = new Date().toISOString()
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, read_at: m.read_at ?? now } : m))
      )
    } catch {
      toast.error("Could not mark this message as read")
    } finally {
      setActioningId(null)
    }
  }

  return (
    <Container className="p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <Heading level="h1">Contact messages</Heading>
          <Text className="text-ui-fg-subtle">
            Submissions from the storefront's Contact Us page.
          </Text>
        </div>
      </div>
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Status</Table.HeaderCell>
            <Table.HeaderCell>From</Table.HeaderCell>
            <Table.HeaderCell>Message</Table.HeaderCell>
            <Table.HeaderCell>Received</Table.HeaderCell>
            <Table.HeaderCell>Actions</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {messages.map((m) => (
            <Table.Row key={m.id}>
              <Table.Cell>
                <Badge color={m.read_at ? "grey" : "blue"}>
                  {m.read_at ? "Read" : "New"}
                </Badge>
              </Table.Cell>
              <Table.Cell>
                <div className="flex flex-col">
                  <Text className="txt-compact-small-plus">{m.name}</Text>
                  <Text className="text-ui-fg-subtle txt-compact-small">
                    {m.email}
                    {m.phone ? ` · ${m.phone}` : ""}
                  </Text>
                </div>
              </Table.Cell>
              <Table.Cell>
                <Text className="max-w-md whitespace-pre-line">{m.message}</Text>
              </Table.Cell>
              <Table.Cell>{new Date(m.created_at).toLocaleString()}</Table.Cell>
              <Table.Cell>
                <Button
                  size="small"
                  variant="secondary"
                  disabled={!!m.read_at}
                  isLoading={actioningId === m.id}
                  onClick={() => handleMarkRead(m.id)}
                >
                  Mark as read
                </Button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      {!isLoading && messages.length === 0 && (
        <div className="px-6 py-8">
          <Text className="text-ui-fg-subtle">No contact messages yet.</Text>
        </div>
      )}
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Contact Messages",
  icon: EnvelopeSolid,
})

export default ContactMessagesPage
