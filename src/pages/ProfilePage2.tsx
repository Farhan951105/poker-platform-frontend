import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ChangePasswordForm from "@/components/ChangePasswordForm";
import { Switch } from "@/components/ui/switch";
import axios from "axios";
import { API_BASE_URL } from "@/lib/constants";
import { countries } from "@/lib/countries";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

const profileFormSchema = z.object({
  username: z.string(),
  email: z.string().email(),
  firstName: z.string().min(1, { message: "First name is required." }),
  country: z.string().min(1, { message: "Country is required." }),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const NotificationSettingsSection: React.FC = () => {
    const [settings, setSettings] = React.useState<any>(null);
    const [loading, setLoading] = React.useState(true);
    const [saving, setSaving] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
        setLoading(true);
        const token = localStorage.getItem("authToken");
        axios.get(`${API_BASE_URL}/api/users/notification-settings`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        })
            .then(res => {
                setSettings(res.data);
                setLoading(false);
            })
            .catch(() => {
                setError("Failed to load notification settings");
                setLoading(false);
            });
    }, []);

    const handleChange = (key: string) => (value: boolean) => {
        setSettings((prev: any) => ({ ...prev, [key]: value }));
    };

    const handleSave = async () => {
        setSaving(true);
        setError(null);
        try {
            const token = localStorage.getItem("authToken");
            await axios.put(`${API_BASE_URL}/api/users/notification-settings`, settings, {
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            });
            toast.success("Notification settings updated!");
        } catch (e: any) {
            setError(e.message);
            toast.error(e.message || "Failed to update settings");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <Card className="mt-8"><CardHeader><CardTitle>Notification Settings</CardTitle></CardHeader><CardContent>Loading...</CardContent></Card>;
    if (error) return <Card className="mt-8"><CardHeader><CardTitle>Notification Settings</CardTitle></CardHeader><CardContent>{error}</CardContent></Card>;
    if (!settings) return null;

    return (
        <Card className="mt-8">
            <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <span>Email Notifications</span>
                        <Switch checked={settings.emailNotifications} onCheckedChange={handleChange("emailNotifications")} />
                    </div>
                    <div className="flex items-center justify-between">
                        <span>On-site Notifications</span>
                        <Switch checked={settings.onSiteNotifications} onCheckedChange={handleChange("onSiteNotifications")} />
                    </div>
                    <div className="flex items-center justify-between">
                        <span>Remind 24h before tournament</span>
                        <Switch checked={settings.notifyBeforeTournament24h} onCheckedChange={handleChange("notifyBeforeTournament24h")} />
                    </div>
                    <div className="flex items-center justify-between">
                        <span>Remind 1h before tournament</span>
                        <Switch checked={settings.notifyBeforeTournament1h} onCheckedChange={handleChange("notifyBeforeTournament1h")} />
                    </div>
                    <div className="flex items-center justify-between">
                        <span>Remind 15m before tournament</span>
                        <Switch checked={settings.notifyBeforeTournament15m} onCheckedChange={handleChange("notifyBeforeTournament15m")} />
                    </div>
                    <div className="flex items-center justify-between">
                        <span>Remind 5m before tournament</span>
                        <Switch checked={settings.notifyBeforeTournament5m} onCheckedChange={handleChange("notifyBeforeTournament5m")} />
                    </div>
                    <Button onClick={handleSave} disabled={saving} className="mt-4">
                        {saving ? "Saving..." : "Save Settings"}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

const ProfilePage = () => {
    const { user, updateUser, updateAvatar } = useAuth();
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const [search, setSearch] = useState("");

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileFormSchema),
        defaultValues: {
            username: user?.username || "",
            email: user?.email || "",
            firstName: user?.firstName || "",
            country: user?.country || "",
        },
    });

    React.useEffect(() => {
        if (user) {
            form.reset({
                username: user.username,
                email: user.email,
                firstName: user.firstName,
                country: user.country,
            });
        }
    }, [user, form]);

    const onSubmit = async (values: ProfileFormValues) => {
        try {
            const dataToUpdate = {
                firstName: values.firstName,
                country: values.country,
            };
            await updateUser(dataToUpdate);
            toast.success("Profile updated successfully!");
        } catch (error: any) {
            toast.error(error.message || "Failed to update profile.");
        }
    };

    const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.error("Please select an image file.");
            return;
        }

        try {
            await updateAvatar(file);
            toast.success("Avatar updated successfully!");
        } catch (error: any) {
            toast.error(error.message || "Failed to update avatar.");
        }
    };

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };
    
    if (!user) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p>Loading profile...</p>
            </div>
        )
    }

    return (
        <>
            <h1 className="text-4xl font-bold text-primary mb-8 animate-fade-in-up">Edit Profile</h1>
            <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <Card>
                    <CardHeader>
                        <CardTitle>Account Details</CardTitle>
                        <CardDescription>Update your personal information. Username and email cannot be changed.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col sm:flex-row gap-8">
                            <div className="flex flex-col items-center gap-4 pt-4">
                                <Avatar className="h-32 w-32">
                                    <AvatarImage src={user.avatarUrl} alt={user.username} />
                                    <AvatarFallback>{user.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleAvatarChange}
                                    className="hidden"
                                    accept="image/*"
                                />
                                <Button variant="outline" onClick={handleButtonClick}>Change Picture</Button>
                            </div>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 flex-1">
                                    <FormField name="username" control={form.control} render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Username</FormLabel>
                                            <FormControl><Input {...field} readOnly className="bg-muted cursor-not-allowed" /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField name="email" control={form.control} render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl><Input {...field} readOnly className="bg-muted cursor-not-allowed" /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField name="firstName" control={form.control} render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>First Name</FormLabel>
                                            <FormControl><Input placeholder="John" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField name="country" control={form.control} render={({ field }) => {
                                        const filteredCountries = countries.filter(
                                            c => c.name.toLowerCase().includes(search.toLowerCase()) || c.code.toLowerCase().includes(search.toLowerCase())
                                        );
                                        return (
                                            <FormItem>
                                                <FormLabel>Country</FormLabel>
                                                <Select value={field.value} onValueChange={field.onChange}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select country" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <div className="px-2 py-1 sticky top-0 bg-popover z-10">
                                                            <input
                                                                type="text"
                                                                placeholder="Search country..."
                                                                value={search}
                                                                onChange={e => setSearch(e.target.value)}
                                                                className="w-full px-2 py-1 border rounded text-sm"
                                                                autoFocus
                                                            />
                                                        </div>
                                                        {filteredCountries.length === 0 ? (
                                                            <div className="px-2 py-2 text-muted-foreground text-sm">No countries found</div>
                                                        ) : (
                                                            filteredCountries.map((country) => (
                                                                <SelectItem key={country.code} value={country.name}>
                                                                    <img
                                                                        src={country.flag}
                                                                        alt={country.code + ' flag'}
                                                                        style={{ width: 20, height: 14, marginRight: 8, display: 'inline-block', verticalAlign: 'middle' }}
                                                                    />
                                                                    {country.name}
                                                                </SelectItem>
                                                            ))
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        );
                                    }} />
                                    <Button type="submit" disabled={form.formState.isSubmitting || !form.formState.isDirty}>
                                        {form.formState.isSubmitting ? 'Saving...' : 'Save Changes'}
                                    </Button>
                                </form>
                            </Form>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <div className="mt-8 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                <ChangePasswordForm />
            </div>
            <NotificationSettingsSection />
        </>
    );
}

export default ProfilePage;
