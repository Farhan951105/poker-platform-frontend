import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogOut, User, History, UserCog, Bell, Check, Loader2 } from "lucide-react";
import { ModeToggle } from "@/components/ModeToggle";
import { useAuth } from "@/contexts/AuthContext";
import Logo from '../../public/logo.png'
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { API_BASE_URL } from "@/lib/constants";
import { io as socketIOClient, Socket } from "socket.io-client";

const Header = () => {
  const { user, logout, isLoading } = useAuth();
  const isLoggedIn = !!user;

  // Notification state
  const [notifications, setNotifications] = useState<any[]>([]);
  const [notifLoading, setNotifLoading] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifPage, setNotifPage] = useState(1);
  const [notifTotal, setNotifTotal] = useState(0);
  const [notifMarking, setNotifMarking] = useState<number | null>(null);

  const unreadCount = notifications.filter(n => !n.readAt).length;

  const fetchNotifications = useCallback(async (page = 1) => {
    setNotifLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      const res = await axios.get(`${API_BASE_URL}/api/users/notifications`, {
        params: { page, limit: 10 },
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      const data = res.data;
      setNotifications(data.rows || []);
      setNotifTotal(data.count || 0);
    } catch (e) {
      // Optionally show toast
    } finally {
      setNotifLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn && notifOpen) {
      fetchNotifications(notifPage);
    }
    // Optionally poll every 60s
    // const interval = setInterval(() => { if (notifOpen) fetchNotifications(notifPage); }, 60000);
    // return () => clearInterval(interval);
  }, [isLoggedIn, notifOpen, notifPage, fetchNotifications]);

  // Socket.IO real-time notifications
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const socket: Socket = socketIOClient("http://localhost:5000", {
      auth: { token },
      transports: ["websocket"],
    });
    socket.on("notification", (notification: any) => {
      setNotifications(prev => [notification, ...prev]);
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  const markAsRead = async (id: number) => {
    setNotifMarking(id);
    try {
      const token = localStorage.getItem("authToken");
      await axios.post(`${API_BASE_URL}/api/users/notifications/${id}/read`, {}, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      setNotifications(notifications => notifications.map(n => n.id === id ? { ...n, readAt: new Date() } : n));
    } catch (e) {}
    setNotifMarking(null);
  };

  if (isLoading) {
    return null; // Or a loading spinner
  }

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link to="/" className="text-2xl font-display text-primary font-bold ">
          <img src={Logo} alt="" className='w-36 cursor-pointer' />
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/tournaments" className="text-muted-foreground hover:text-primary transition-colors">Tournaments</Link>
          <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">About</Link>
          <Link to="/learn" className="text-muted-foreground hover:text-primary transition-colors">Learn Poker</Link>
        </nav>
        <div className="flex items-center gap-4">
          {isLoggedIn && (
            <DropdownMenu open={notifOpen} onOpenChange={setNotifOpen}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
                  <Bell className="h-6 w-6" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[1.2em] text-center">
                      {unreadCount}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-80 max-h-96 overflow-y-auto" align="end" forceMount>
                <DropdownMenuLabel className="font-semibold">Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {notifLoading ? (
                  <div className="flex justify-center items-center py-8"><Loader2 className="animate-spin mr-2" /> Loading...</div>
                ) : notifications.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">No notifications</div>
                ) : notifications.map(n => (
                  <DropdownMenuItem key={n.id} className="flex flex-col items-start gap-1 group">
                    <div className="flex items-center w-full">
                      <span className={`font-medium flex-1 ${!n.readAt ? '' : 'text-muted-foreground'}`}>{n.title}</span>
                      {!n.readAt && (
                        <Button size="icon" variant="ghost" className="ml-2" disabled={notifMarking === n.id} onClick={e => { e.stopPropagation(); markAsRead(n.id); }}>
                          {notifMarking === n.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4 text-green-500" />}
                        </Button>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">{new Date(n.sendAt).toLocaleString()}</span>
                    <span className="text-sm">{n.body}</span>
                  </DropdownMenuItem>
                ))}
                {/* Pagination controls if needed */}
                {notifTotal > 10 && (
                  <div className="flex justify-between items-center px-2 py-1">
                    <Button size="sm" variant="ghost" disabled={notifPage === 1} onClick={() => setNotifPage(p => Math.max(1, p - 1))}>Prev</Button>
                    <span className="text-xs">Page {notifPage}</span>
                    <Button size="sm" variant="ghost" disabled={notifPage * 10 >= notifTotal} onClick={() => setNotifPage(p => p + 1)}>Next</Button>
                  </div>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.avatarUrl} alt={user.username} />
                    <AvatarFallback>{user.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.username}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/dashboard">
                    <User className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/profile">
                    <UserCog className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/hand-history">
                    <History className="mr-2 h-4 w-4" />
                    <span>Hand History</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="outline" asChild>
                <Link to="/login">Log In</Link>
              </Button>
              <Button asChild>
                <Link to="/register">Sign Up</Link>
              </Button>
            </div>
          )}
          <ModeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;
