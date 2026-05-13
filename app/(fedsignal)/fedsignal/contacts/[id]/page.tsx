"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Edit2,
  Mail,
  Phone,
  Building2,
  Star,
  User,
  FileText,
  Calendar,
  ExternalLink,
} from "lucide-react";

interface Contact {
  id: string;
  name: string;
  title: string;
  organization: string;
  email: string;
  phone?: string;
  type: "prime" | "agency" | "hbcu" | "small_business" | "other";
  universityId?: string;
  expertise?: string[];
  notes?: string;
  isFavorite: boolean;
  lastContact?: any;
}

export default function ContactDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [contact, setContact] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchContact(params.id as string);
    }
  }, [params.id]);

  const fetchContact = async (id: string) => {
    try {
      const response = await fetch(`/api/fedsignal/contacts/${id}`);
      const result = await response.json();
      if (result.success) {
        setContact(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch contact:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-muted-foreground">Loading contact...</div>;
  }

  if (!contact) {
    return <div className="text-center py-12 text-muted-foreground">Contact not found</div>;
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "prime": return "bg-purple-100 text-purple-700 border-purple-200";
      case "agency": return "bg-blue-100 text-blue-700 border-blue-200";
      case "hbcu": return "bg-green-100 text-green-700 border-green-200";
      case "small_business": return "bg-amber-100 text-amber-700 border-amber-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/fedsignal/contacts">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{contact.name}</h1>
          <p className="text-muted-foreground">{contact.title} at {contact.organization}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Edit2 className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
      </div>

      {/* Overview Card */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{contact.name}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <span>{contact.organization}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <a href={`mailto:${contact.email}`} className="hover:text-primary">
                    {contact.email}
                  </a>
                </div>
                {contact.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <a href={`tel:${contact.phone}`} className="hover:text-primary">
                      {contact.phone}
                    </a>
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <Badge className={getTypeColor(contact.type)}>
                  {contact.type.replace("_", " ").toUpperCase()}
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setContact(contact ? { ...contact, isFavorite: !contact.isFavorite } : null)}
                >
                  <Star
                    className="h-4 w-4 mr-2"
                    fill={contact.isFavorite ? "currentColor" : "none"}
                  />
                  {contact.isFavorite ? "Favorite" : "Add to Favorites"}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Details */}
      <Tabs defaultValue="expertise">
        <TabsList>
          <TabsTrigger value="expertise">Expertise</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>
        <TabsContent value="expertise" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Areas of Expertise</CardTitle>
            </CardHeader>
            <CardContent>
              {contact.expertise && contact.expertise.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {contact.expertise.map((exp) => (
                    <Badge key={exp} variant="secondary">
                      {exp}
                    </Badge>
                  ))}
                </div>
              ) : (
                <div className="text-muted-foreground">No expertise areas listed</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="notes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent>
              {contact.notes ? (
                <p className="text-sm">{contact.notes}</p>
              ) : (
                <div className="text-muted-foreground">No notes available</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Activity History</CardTitle>
            </CardHeader>
            <CardContent>
              {contact.lastContact ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Last Contact: {new Date(contact.lastContact.seconds * 1000).toLocaleDateString()}</span>
                  </div>
                </div>
              ) : (
                <div className="text-muted-foreground">No recent activity recorded</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
