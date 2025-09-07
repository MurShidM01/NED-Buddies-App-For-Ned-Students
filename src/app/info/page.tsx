
"use client";

import Link from 'next/link';
import { useState } from 'react';
import { ArrowLeft, Info, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

const CURRENT_VERSION = "1.0.0";

export default function InfoPage() {
    const [isChecking, setIsChecking] = useState(false);
    const [updateMessage, setUpdateMessage] = useState("");
    const { toast } = useToast();

    const handleUpdateCheck = async () => {
        setIsChecking(true);
        setUpdateMessage("");
        try {
            // This is now just for user feedback, the main check is automatic.
            const res = await fetch('https://api.github.com/repos/MurShidM01/NED-Buddies-App-For-Ned-Students/releases/latest');
            if (!res.ok) {
                throw new Error(`GitHub API error: ${res.status}`);
            }
            const latestRelease = await res.json();
            const latestVersion = latestRelease.tag_name.replace('v', '');

            if (latestVersion > CURRENT_VERSION) {
                setUpdateMessage("Update available! The app will prompt you to update automatically.");
            } else {
                setUpdateMessage("You are using the latest version.");
            }
        } catch (error) {
            console.error("Failed to check for updates:", error);
            setUpdateMessage("");
            toast({
                title: "Update Check Failed",
                description: "Could not check for updates. Please try again later.",
                variant: "destructive",
            });
        } finally {
            setIsChecking(false);
        }
    };


  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md relative">
        <div className="absolute top-4 left-4">
            <Button variant="ghost" size="icon" asChild>
                <Link href="/chat">
                    <ArrowLeft />
                </Link>
            </Button>
        </div>
        <CardHeader className="items-center text-center">
            <Info className="h-12 w-12 text-primary" />
            <CardTitle className="pt-4">App Information</CardTitle>
            <CardDescription>Details about the NED Buddies application.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
                <span className="text-muted-foreground">App Name</span>
                <span className="font-semibold">NED Buddies</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Version</span>
                <span className="font-semibold">{CURRENT_VERSION}</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Developer</span>
                <span className="font-semibold">Ali Khan</span>
            </div>
        </CardContent>
        <CardFooter className="flex-col gap-4">
            <Button onClick={handleUpdateCheck} className="w-full" disabled={isChecking}>
                {isChecking ? <Loader2 className="animate-spin" /> : "Check for Updates"}
            </Button>
            {updateMessage && (
                 <p className="text-sm text-center text-muted-foreground pt-2">{updateMessage}</p>
            )}
        </CardFooter>
      </Card>
    </div>
  );
}
