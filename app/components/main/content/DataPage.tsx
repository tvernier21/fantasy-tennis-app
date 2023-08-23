'use client';

import React from "react"
import { 
    Tabs,
    TabsHeader,
    TabsBody,
    Tab,
    TabPanel,
} from "@material-tailwind/react";

interface DataPageProps {
    sumting?: any;
}

const DataPage: React.FC<DataPageProps> = ({
    sumting
}) => {
    const [activeTab, setActiveTab] = React.useState("results");
    const data = [
        {
          label: "results",
          value: "results",
          desc: `It really matters and then like it really doesn't matter.
          What matters is the people who are sparked by it. And the people 
          who are like offended by it, it doesn't matter.`,
        },
        {
          label: "draws",
          value: "draws",
          desc: `We are still working on making this feature available`,
        },
        {
          label: "live scores",
          value: "live scores",
          desc: `We are still working on making this feature available.`,
        }
    ];

    return (
        <div>
            <Tabs value={activeTab} className="pt-1">
                <TabsHeader
                    className="rounded-none border-b border-blue-gray-50 bg-transparent p-0"
                    indicatorProps={{
                    className:
                        "bg-transparent border-b-2 border-gray-900 shadow-none rounded-none",
                    }}
                >
                    {data.map(({ label, value }) => (
                        <Tab
                            key={value}
                            value={value}
                            onClick={() => setActiveTab(value)}
                        >
                            {label}
                        </Tab>
                    ))}
                </TabsHeader>
                <TabsBody>
                    <div className="pt-2">
                        {activeTab === "results" && (
                            <div>DATA</div>
                        )}
                        {activeTab !== "results"  && (
                            <div>
                                {data.map(({ value, desc }) => (
                                    <TabPanel key={value} value={value}>
                                        {desc}
                                    </TabPanel>
                                ))}
                            </div>
                        )}
                    </div>      
                </TabsBody>
            </Tabs>
        </div>
    )
};

export default DataPage;