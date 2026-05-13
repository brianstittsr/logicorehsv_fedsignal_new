"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  Search,
  Filter,
  Plus,
  Building2,
  Mail,
  Phone,
  Star,
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

export default function ContactsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [favoriteFilter, setFavoriteFilter] = useState<string>("all");
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await fetch("/api/fedsignal/contacts");
      const result = await response.json();
      if (result.success) {
        setContacts(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch contacts:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch =
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || contact.type === typeFilter;
    const matchesFavorite =
      favoriteFilter === "all" ||
      (favoriteFilter === "favorites" && contact.isFavorite) ||
      (favoriteFilter === "non-favorites" && !contact.isFavorite);
    return matchesSearch && matchesType && matchesFavorite;
  });

  const toggleFavorite = (id: string) => {
    setContacts((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isFavorite: !c.isFavorite } : c))
    );
  };

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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            Contacts
          </h1>
          <p className="text-muted-foreground">
            Manage your network of prime contractors, agencies, and partners
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Contact
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search contacts by name, organization, or email..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[180px]">
                  <Building2 className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="prime">Prime Contractor</SelectItem>
                  <SelectItem value="agency">Agency</SelectItem>
                  <SelectItem value="hbcu">HBCU</SelectItem>
                  <SelectItem value="small_business">Small Business</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <Select value={favoriteFilter} onValueChange={setFavoriteFilter}>
                <SelectTrigger className="w-[180px]">
                  <Star className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Favorites" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Contacts</SelectItem>
                  <SelectItem value="favorites">Favorites Only</SelectItem>
                  <SelectItem value="non-favorites">Non-Favorites</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contacts List */}
      {loading ? (
        <Card className="p-12 text-center">
          <div className="text-muted-foreground">Loading contacts...</div>
        </Card>
      ) : filteredContacts.length === 0 ? (
        <Card className="p-12 text-center">
          <Users className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No contacts found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search or filters, or add a new contact
          </p>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredContacts.map((contact) => (
            <Card key={contact.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{contact.name}</CardTitle>
                    <CardDescription className="mt-1">{contact.title}</CardDescription>
                    <CardDescription className="mt-1">{contact.organization}</CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleFavorite(contact.id)}
                  >
                    <Star
                      className="h-4 w-4"
                      fill={contact.isFavorite ? "currentColor" : "none"}
                    />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Badge className={getTypeColor(contact.type)}>
                      {contact.type.replace("_", " ").toUpperCase()}
                    </Badge>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <a href={`mailto:${contact.email}`} className="hover:text-primary">
                        {contact.email}
                      </a>
                    </div>
                    {contact.phone && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        <a href={`tel:${contact.phone}`} className="hover:text-primary">
                          {contact.phone}
                        </a>
                      </div>
                    )}
                  </div>
                  {contact.expertise && contact.expertise.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {contact.expertise.slice(0, 3).map((exp) => (
                        <Badge key={exp} variant="secondary" className="text-xs">
                          {exp}
                        </Badge>
                      ))}
                      {contact.expertise.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{contact.expertise.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1" asChild>
                      <Link href={`/fedsignal/contacts/${contact.id}`}>View Details</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
