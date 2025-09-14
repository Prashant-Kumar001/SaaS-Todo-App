import React from 'react'
import { Card, CardContent, CardHeader } from '../ui/card'

const Loading = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
            <div className="max-w-4xl mx-auto space-y-5 ">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-1.5 px-3 py-3 bg-white border bottom-2">
                    <div className="flex items-center gap-2">
                        <div className="w-56 h-32 bg-slate-200 rounded animate-pulse"></div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-56 h-32 bg-slate-200 rounded animate-pulse"></div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-56 h-32 bg-slate-200 rounded animate-pulse"></div>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <div className="w-5 h-5 bg-slate-200 rounded animate-pulse"></div>
                                <div className="h-6 bg-slate-200 rounded-md w-40 animate-pulse"></div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                                <div className="w-4 h-4 bg-slate-200 rounded animate-pulse"></div>
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-slate-200 rounded w-16 animate-pulse"></div>
                                    <div className="h-4 bg-slate-200 rounded w-48 animate-pulse"></div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                                <div className="w-4 h-4 bg-slate-200 rounded animate-pulse"></div>
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-slate-200 rounded w-20 animate-pulse"></div>
                                    <div className="h-3 bg-slate-200 rounded w-32 animate-pulse"></div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default Loading