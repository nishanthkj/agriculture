import Sidebar from '@/components/Sidebar';

const Dashboard = () => (
    <div className="dashboard">
        <Sidebar />
        <div className="content">
            <h1>Welcome to the Agriculture Dashboard</h1>
            <p>Get insights on crop health, soil conditions, pest prediction, and more!</p>
        </div>
    </div>
);

export default Dashboard;