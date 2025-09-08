"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { AlertTriangle, Loader2Icon } from "lucide-react";
import { LuPlus, LuTrash2, LuCircle } from "react-icons/lu";
import { CiCircleCheck } from "react-icons/ci";
import { FaStar } from "react-icons/fa";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { userClient } from "@/lib/userClient";
import { AppDispatch, RootState } from "@/lib/store";
import { addTodos, deleteTodo, toggleTodos } from "@/lib/store/slices/meSlice";
import LoadingOverlay from "@/components/ui/loader";
import { Action, ITodo } from "@/types";

const TodoItem = ({ todo, setLoading }: { todo: ITodo, setLoading: (loading: boolean) => void }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [error, setError] = useState("");

  const toggleTodo = async (action: Action) => {
    if (!todo.id) {
      toast.error("Invalid todo");
      return;
    }

    setLoading(true);

    try {
      const res = await userClient.toggleTodo(
        todo.id,
        todo.status,
        todo.priority,
        action
      );
      if (res.success) {
        dispatch(toggleTodos(res.data));
        toast.success(`Todo ${action.toLowerCase()} updated successfully`);
      } else {
        setError(res.error || "Failed to update");
      }
    } catch (e: any) {
      setError(e.message || "Failed to update");
    }finally {
      setLoading(false);
    }
  };

  const deleteTodoHandler = async () => {
    if (!todo.id) {
      toast.error("Invalid todo");
      return;
    }

    if (!confirm("Are you sure you want to delete this todo?")) return;

    setLoading(true);

    try {
      const res = await userClient.deleteTodo(todo.id);
      if (res.success) {
        dispatch(deleteTodo(todo.id));
        toast.success("Todo deleted successfully");
      } else {
        setError(res.error || "Failed to delete");
      }
    } catch (e: any) {
      setError(e.message || "Failed to delete");
    }finally {
      setLoading(false);
    }
  };

  return (
    <li
      className={`flex items-center justify-between p-4 rounded-lg border transition-all duration-200 ${
        todo.priority === "HIGH"
          ? "bg-rose-50 border-rose-200"
          : "bg-white border-slate-200"
      } ${todo.status === "DONE" ? "opacity-75" : ""}`}
    >
      <div className="flex items-center gap-3">
        <button
          onClick={() => toggleTodo("STATUS")}
          aria-label={`Mark todo as ${
            todo.status === "DONE" ? "PENDING" : "DONE"
          }`}
          className="focus:outline-none"
        >
          {todo.status === "DONE" ? (
            <CiCircleCheck size={24} className="text-green-600" />
          ) : (
            <LuCircle size={24} className="text-slate-400" />
          )}
        </button>
        <button
          onClick={() => toggleTodo("PRIORITY")}
          aria-label={`Mark todo as ${
            todo.priority === "HIGH" ? "LOW" : "HIGH"
          } priority`}
          className="focus:outline-none"
        >
          <FaStar
            size={22}
            className={
              todo.priority === "HIGH" ? "text-amber-400" : "text-slate-300"
            }
          />
        </button>
        <div className="flex flex-col">
          <div
            className={`text-sm font-medium ${
              todo.status === "DONE"
                ? "line-through text-slate-500"
                : "text-slate-800"
            }`}
          >
            {todo.title}
          </div>
          <div className="flex items-center gap-2 mt-1.5">
            <div className="text-xs  text-slate-500">
              created{" "}
              {formatDistanceToNow(new Date(todo.createdAt), {
                addSuffix: true,
              })}
            </div>
            {todo.completedAt && (
              <div className="text-xs text-slate-500">
                completed{" "}
                {formatDistanceToNow(new Date(todo.completedAt), {
                  addSuffix: true,
                })}
              </div>
            )}
            {todo.updatedAt > todo.createdAt && (
              <div className="text-xs text-slate-500">
                updated{" "}
                {formatDistanceToNow(new Date(todo.updatedAt), {
                  addSuffix: true,
                })}
              </div>
            )}
          </div>
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={deleteTodoHandler}
        aria-label="Delete todo"
        className="text-red-500 hover:text-red-600 hover:bg-red-50"
      >
        <LuTrash2 />
      </Button>
      {error && (
        <Alert variant="destructive" className="mt-2">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </li>
  );
};

export default function TodosPage() {
  const [newTodo, setNewTodo] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { todos, subscription, loading: todosLoading } = useSelector(
    (state: RootState) => state.dashboard
  );
  const dispatch = useDispatch<AppDispatch>();

  const addTodo = async () => {
    if (!newTodo.trim()) {
      toast.error("Todo cannot be empty");
      return;
    }
    if (newTodo.length > 100) {
      toast.error("Todo title cannot exceed 100 characters");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const res = await userClient.createTodo({
        title: newTodo.trim(),
      });
      if (res.success) {
        dispatch(addTodos(res.data));
        setNewTodo("");
        toast.success("Todo added successfully");
      } else {
        setError(res.error || "Failed to add todo");
      }
    } catch (e: any) {
      setError(e.message || "Failed to add todo");
    } finally {
      setLoading(false);
    }
  };

  const trialEndsAt = subscription?.trialEndsAt
    ? new Date(subscription.trialEndsAt)
    : null;

     if (todosLoading) {
       return (
         <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
           <div className="max-w-4xl mx-auto space-y-5 ">
             <div className="flex flex-col gap-1.5 px-3 py-3 bg-white border bottom-2">
               <div className="flex items-center gap-2">
                 <div className="w-full h-12 bg-slate-200 rounded animate-pulse"></div>
               </div>
               <div className="flex items-center gap-2">
                 <div className="w-full h-12 bg-slate-200 rounded animate-pulse"></div>
               </div>
               <div className="flex items-center gap-2">
                 <div className="w-full h-12 bg-slate-200 rounded animate-pulse"></div>
               </div>
               <div className="flex items-center gap-2">
                 <div className="w-full h-12 bg-slate-200 rounded animate-pulse"></div>
               </div>
               <div className="flex items-center gap-2">
                 <div className="w-full h-12 bg-slate-200 rounded animate-pulse"></div>
               </div>
               <div className="flex items-center gap-2">
                 <div className="w-full h-12 bg-slate-200 rounded animate-pulse"></div>
               </div>
               <div className="flex items-center gap-2">
                 <div className="w-full h-12 bg-slate-200 rounded animate-pulse"></div>
               </div>
               <div className="flex items-center gap-2">
                 <div className="w-full h-12 bg-slate-200 rounded animate-pulse"></div>
               </div>
             </div>
             
           </div>
         </div>
       );
     }

  return (
    <div className="space-y-6">
      <Card className="rounded-xl border-slate-200 shadow-lg">
        <CardHeader className="border-b border-slate-200">
          <CardTitle className="text-2xl font-semibold text-slate-800">
            Todos
          </CardTitle>
          <div>
            <p className="text-sm text-slate-500">
              {todos.length} {todos.length === 1 ? "todo" : "todos"}
            </p>
          </div>
          {subscription?.status === "TRIALING" && (
            <Alert className="rounded-xl border-amber-200 bg-amber-50">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800">
                Your trial expires{" "}
                {trialEndsAt
                  ? `in ${Math.ceil(
                      (trialEndsAt.getTime() - Date.now()) /
                        (1000 * 60 * 60 * 24)
                    )} days`
                  : "soon"}
                . Upgrade now to continue enjoying all features.
              </AlertDescription>
            </Alert>
          )}
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="flex gap-3">
            <Input
              placeholder="Add a new todo…"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTodo()}
              className="rounded-lg border-slate-300 focus:ring-2 focus:ring-blue-500"
            />
            <Button
              onClick={addTodo}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            >
              {loading ? <Loader2Icon className="animate-spin" /> : <LuPlus />}
            </Button>
          </div>

          {error && (
            <Alert variant="destructive" className="rounded-lg">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <ul className="space-y-3">
            {todos.length === 0 ? (
              <li className="text-center py-10 text-sm text-slate-500">
                No todos yet. Add a task above to get started.
              </li>
            ) : (
              todos.map((todo) => (
                <TodoItem key={todo.id} todo={todo} setLoading={setLoading}   />
              ))
            )}
          </ul>
        </CardContent>
      </Card>
      <LoadingOverlay isLoading={loading} />
    </div>
  );
}
