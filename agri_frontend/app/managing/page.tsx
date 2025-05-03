'use client';
//import { useRouter } from 'next/navigation';
//import { cookies } from 'next/headers';
import LoginRequired from '@/components/LoginRequired/LoginRequired';
import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import {
  Pagination, PaginationContent, PaginationItem, PaginationPrevious,
  PaginationNext, PaginationLink,
} from "@/components/ui/pagination";
import toast from 'react-hot-toast';
//import { set } from 'date-fns';

const ITEMS_PER_PAGE = 5;

interface Stock {
  id: string;
  name: string;
  quantity: number;
  location: string;
  cost: number;
  sellingPrice: number;
  userId: string;
  createdAt: string;
}

interface Worker {
  id: string;
  name: string;
  role: string;
  farm: string;
  cost: number;
  userId: string;
  createdAt: string;
}

export default function ManagingPage() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [stockForm, setStockForm] = useState({ name: '', quantity: '', location: '', cost: '', sellingPrice: '' });
  const [workerForm, setWorkerForm] = useState({ name: '', role: '', farm: '' });
  const [searchStock, setSearchStock] = useState('');
  const [searchWorker, setSearchWorker] = useState('');
  const [stockPage, setStockPage] = useState(1);
  const [workerPage, setWorkerPage] = useState(1);

  const filteredStocks = Array.isArray(stocks) ? stocks.filter(stock =>
    stock.name.toLowerCase().includes(searchStock.toLowerCase())
  ) : [];


  const filteredWorkers = Array.isArray(workers) ? workers.filter(worker =>
    worker.name.toLowerCase().includes(searchWorker.toLowerCase())
  ) : [];

  const totalStockQuantity = filteredStocks.reduce((sum, stock) => sum + stock.quantity, 0);
  const totalStockProfit = filteredStocks.reduce((sum, stock) => sum + (stock.sellingPrice - stock.cost) * stock.quantity, 0);
  const totalWorkerCost = filteredWorkers.reduce((sum, worker) => sum + worker.cost, 0);

  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);


  //const router = useRouter();
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/profile', {
          method: 'GET',
          credentials: 'include',
        });

        if (res.ok) {
          setIsAuthenticated(true);
          fetchData();
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Auth check failed", error);
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);


  // Helper function to get the cookie by name asynchronously
  // const getCookie = async (name: string) => {
  //   const value = `; ${document.cookie}`;
  //   const parts = value.split(`; ${name}=`);
  //   if (parts.length === 2) {
  //     return parts.pop()?.split(';').shift() ?? null;
  //   }
  //   return null;
  // };
  const fetchData = async () => {
    const stockRes = await fetch('/api/stocks');
    const workerRes = await fetch('/api/workers');

    const stockData = await stockRes.json();
    const workerData = await workerRes.json();

    setStocks(stockData);
    setWorkers(workerData);
  };

  // if (isAuthenticated === false) {
  //   router.push('/login');
  //   return null;
  // }
  // Redirect after 1 second if not authenticated
  const addStock = async () => {
    const { name, quantity, location, cost, sellingPrice } = stockForm;
    if (!name || !quantity || !location || !cost || !sellingPrice) {
      toast.error('Please fill in all fields');
      return;
    }

    const res = await fetch('/api/stocks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        quantity: parseInt(quantity),
        location,
        cost: parseFloat(cost),
        sellingPrice: parseFloat(sellingPrice),
      }),
    });

    if (res.ok) {
      toast.success('Stock added!');
      setStockForm({ name: '', quantity: '', location: '', cost: '', sellingPrice: '' });
      fetchData();
    } else toast.error('Failed to add stock.');
  };

  const addWorker = async () => {
    const { name, role, farm } = workerForm;
    if (!name || !role || !farm) {
      toast.error('Please fill in all fields');
      return;
    }

    const res = await fetch('/api/workers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(workerForm),
    });

    if (res.ok) {
      toast.success('Worker added!');
      setWorkerForm({ name: '', role: '', farm: '' });
      fetchData();
    } else toast.error('Failed to add worker.');
  };

  const deleteStock = async (id: string) => {
    const res = await fetch(`/api/stocks/${id}`, { method: 'DELETE' });
    if (res.ok) {
      toast.success('Deleted');
    } else {
      toast.error('Failed');
    }
    fetchData();
  };

  const deleteWorker = async (id: string) => {
    const res = await fetch(`/api/workers/${id}`, { method: 'DELETE' });
    if (res.ok) {
      toast.success('Deleted');
    } else {
      toast.error('Failed');
    }
    fetchData();
  };
  const updateStock = async (id: string, quantity: number, cost: number, sellingPrice: number) => {
    try {
      const res = await fetch(`/api/stocks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity, cost, sellingPrice }),
      });

      if (res.ok) {
        toast.success("Stock updated!");
        fetchData();
      } else {
        toast.error("Failed to update stock.");
      }
    } catch (error) {
      toast.error("Error updating stock.");
      console.error(error);
    }
  };
  const updateWorker = async (id: string, cost: number) => {
    try {
      const res = await fetch(`/api/workers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cost }),
      });

      if (res.ok) {
        toast.success("Worker updated!");
        fetchData(); // refresh data
      } else {
        toast.error("Failed to update worker.");
      }
    } catch (error) {
      toast.error("Error updating worker.");
      console.error(error);
    }
  };

  const paginate = <T,>(data: T[], page: number): T[] =>
    data.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const totalStockPages = Math.ceil(filteredStocks.length / ITEMS_PER_PAGE);
  const totalWorkerPages = Math.ceil(filteredWorkers.length / ITEMS_PER_PAGE);
  //if (isAuthenticated === null) return <p className="text-center mt-10">Checking authentication...</p>;

  return isAuthenticated === null ? (<div> Login </div>
  ) : isAuthenticated === false ? (<LoginRequired />) :  (

    <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
      {/* STOCKS */}
      <Card className="p-6 space-y-4">
        <h2 className="text-2xl font-bold">Stocks</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 lg:grid-cols-6 gap-4">
          <Input placeholder="Name" value={stockForm.name} onChange={e => setStockForm({ ...stockForm, name: e.target.value })} />
          <Input placeholder="Quantity" type="number" value={stockForm.quantity} onChange={e => setStockForm({ ...stockForm, quantity: e.target.value })} />
          <Input placeholder="Location" value={stockForm.location} onChange={e => setStockForm({ ...stockForm, location: e.target.value })} />
          <Input placeholder="Cost" type="number" value={stockForm.cost} onChange={e => setStockForm({ ...stockForm, cost: e.target.value })} />
          <Input placeholder="Selling Price" type="number" value={stockForm.sellingPrice} onChange={e => setStockForm({ ...stockForm, sellingPrice: e.target.value })} />
          <Button onClick={addStock}>Add Stock</Button>
        </div>

        <Input className="max-w-xs" placeholder="Search Stock" value={searchStock} onChange={e => setSearchStock(e.target.value)} />

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Cost</TableHead>
              <TableHead>Selling Price</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginate(filteredStocks, stockPage).map(stock => (
              <TableRow key={stock.id}>
                <TableCell>{stock.name}</TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={stock.quantity}
                    onChange={(e) => {
                      const updated = stocks.map(s =>
                        s.id === stock.id ? { ...s, quantity: parseInt(e.target.value) } : s
                      );
                      setStocks(updated);
                    }}
                  />
                </TableCell>
                <TableCell>{stock.location}</TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={stock.cost}
                    onChange={(e) => {
                      const updated = stocks.map(s =>
                        s.id === stock.id ? { ...s, cost: parseFloat(e.target.value) } : s
                      );
                      setStocks(updated);
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={stock.sellingPrice}
                    onChange={(e) => {
                      const updated = stocks.map(s =>
                        s.id === stock.id ? { ...s, sellingPrice: parseFloat(e.target.value) } : s
                      );
                      setStocks(updated);
                    }}
                  />
                </TableCell>
                <TableCell className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => updateStock(stock.id, stock.quantity, stock.cost, stock.sellingPrice)}
                  >
                    Update
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteStock(stock.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>

        </Table>

        <div className="flex justify-between text-sm text-muted-foreground px-2 pt-4">
          <p>Total Quantity: {totalStockQuantity}</p>
          <p>Total Profit: ₹{totalStockProfit.toFixed(2)}</p>
        </div>

        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" onClick={e => {
                e.preventDefault();
                setStockPage(prev => Math.max(prev - 1, 1));
              }} />
            </PaginationItem>
            {Array.from({ length: totalStockPages }).map((_, index) => (
              <PaginationItem key={index}>
                <PaginationLink href="#" isActive={stockPage === index + 1} onClick={e => {
                  e.preventDefault();
                  setStockPage(index + 1);
                }}>{index + 1}</PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext href="#" onClick={e => {
                e.preventDefault();
                setStockPage(prev => Math.min(prev + 1, totalStockPages));
              }} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </Card>

      {/* WORKERS */}
      <Card className="p-6 space-y-4">
        <h2 className="text-2xl font-bold">Workers</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input placeholder="Name" value={workerForm.name} onChange={e => setWorkerForm({ ...workerForm, name: e.target.value })} />
          <Input placeholder="Role" value={workerForm.role} onChange={e => setWorkerForm({ ...workerForm, role: e.target.value })} />
          <Input placeholder="Farm" value={workerForm.farm} onChange={e => setWorkerForm({ ...workerForm, farm: e.target.value })} />
          <Button onClick={addWorker}>Add Worker</Button>
        </div>

        <Input className="max-w-xs" placeholder="Search Worker" value={searchWorker} onChange={e => setSearchWorker(e.target.value)} />

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Farm</TableHead>
              <TableHead>Cost</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginate(filteredWorkers, workerPage).map(worker => (
              <TableRow key={worker.id}>
                <TableCell>{worker.name}</TableCell>
                <TableCell>{worker.role}</TableCell>
                <TableCell>{worker.farm}</TableCell>

                <TableCell>
                  <Input
                    type="number"
                    value={worker.cost}
                    onChange={(e) => {
                      const updated = workers.map(w =>
                        w.id === worker.id ? { ...w, cost: parseFloat(e.target.value) } : w
                      );
                      setWorkers(updated);
                    }}
                  />
                </TableCell>

                <TableCell className="flex gap-2">
                  <Button size="sm" onClick={() => updateWorker(worker.id, worker.cost)}>Update</Button>
                  <Button size="sm" variant="destructive" onClick={() => deleteWorker(worker.id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>

        </Table>

        <div className="flex justify-end text-sm text-muted-foreground px-2 pt-4">
          <p>Total Worker Cost: ₹{totalWorkerCost.toFixed(2)}</p>
        </div>

        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" onClick={e => {
                e.preventDefault();
                setWorkerPage(prev => Math.max(prev - 1, 1));
              }} />
            </PaginationItem>
            {Array.from({ length: totalWorkerPages }).map((_, index) => (
              <PaginationItem key={index}>
                <PaginationLink href="#" isActive={workerPage === index + 1} onClick={e => {
                  e.preventDefault();
                  setWorkerPage(index + 1);
                }}>{index + 1}</PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext href="#" onClick={e => {
                e.preventDefault();
                setWorkerPage(prev => Math.min(prev + 1, totalWorkerPages));
              }} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </Card>
    </div>
  ) ;
}
