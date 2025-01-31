import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Contact() {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-8 text-center">Contact Us</h1>
            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle>Get in Touch</CardTitle>
                </CardHeader>

                <CardContent className="space-y-6">
                    <div>
                        <h2 className="text-lg font-semibold mb-2">Address</h2>
                        <p className="text-foreground/70">
                            No. 30, Agadez Cres.
                            <br />
                            Wuse ll, Abuja, Nigeria.
                        </p>
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold mb-2">Phone</h2>
                        <p className="text-foreground/70">+2348035901047</p>
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold mb-2">Email</h2>
                        <p className="text-foreground/70">
                            submissions@cavicfestival.africa
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
