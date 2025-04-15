import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, UploadCloud } from "lucide-react";
import axios from "axios";
import clsx from "clsx";

export default function ActivitiesPage() {
  const [activities, setActivities] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [assets, setAssets] = useState([]);
  const [selectedAssets, setSelectedAssets] = useState([]);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    const res = await axios.get("http://localhost:8000/ilp/v1/activities");
    setActivities(res.data);
  };

  const handleAddActivity = async () => {
    const res = await axios.post("http://localhost:8000/ilp/v1/activities", {
      ...formData,
      assets: selectedAssets,
    });
    setFormData({ name: "", description: "" });
    setSelectedAssets([]);
    setOpenDialog(false);
    fetchActivities();
  };

  const handleAssetUpload = async (e) => {
    const file = e.target.files[0];
    const form = new FormData();
    form.append("file", file);
    const res = await axios.post("/api/assets", form);
    setAssets([...assets, res.data]);
  };

  const toggleAssetSelection = (assetId) => {
    setSelectedAssets((prev) =>
      prev.includes(assetId)
        ? prev.filter((id) => id !== assetId)
        : [...prev, assetId]
    );
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Activities</h1>
        <Button onClick={() => setOpenDialog(true)}>
          <PlusCircle className="mr-2" /> Add Activity
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {activities.map((activity) => (
          <Card key={activity.id} className="shadow hover:shadow-lg transition">
            <CardContent>
              <CardTitle>{activity.name}</CardTitle>
              <CardDescription>{activity.description}</CardDescription>
              <div className="mt-2 text-sm text-muted-foreground">
                <strong>Assets:</strong> {activity.assets?.length || 0}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-lg">
          <DialogTitle>Add New Activity</DialogTitle>
          <div className="space-y-4">
            <Input
              placeholder="Activity Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
            <Textarea
              placeholder="Activity Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />

            <div className="space-y-2">
              <label className="text-sm font-medium">Attach Assets</label>
              <div className="flex items-center gap-2">
                <Input type="file" onChange={handleAssetUpload} />
                <UploadCloud className="text-muted-foreground" />
              </div>
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-auto">
                {assets.map((asset) => (
                  <div
                    key={asset.id}
                    className={clsx(
                      "p-2 border rounded cursor-pointer",
                      selectedAssets.includes(asset.id)
                        ? "border-blue-500 bg-blue-50"
                        : "hover:border-gray-400"
                    )}
                    onClick={() => toggleAssetSelection(asset.id)}
                  >
                    <p className="text-sm font-semibold truncate">
                      {asset.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {asset.type}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-right">
              <Button onClick={handleAddActivity}>Save Activity</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
