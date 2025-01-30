import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PageTitle from './components/PageTitle'; // Component for setting the page title
import Activities from './pages/Activity/Activities'; // Home Page
import AddEditActivity from './pages/Activity/AddEditActivity'; // Add/Edit Page
import ActivityDetails from './pages/Activity/ActivityDetails';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Home Page */}
        <Route
          path="/"
          element={
            <>
              <PageTitle title="Activities | Best Activity Management Software" />
              <Activities />
            </>
          }
        />

        {/* Add/Edit Activity Page */}
        <Route
          path="/add-edit-activity"
          element={
            <>
              <PageTitle title="Add Activity | Best Activity Management Software" />
              <AddEditActivity />
            </>
          }
        />
        <Route
          path="/add-activity"
          element={
            <>
              <PageTitle title="Edit Activity | Best Activity Management Software" />
              <AddEditActivity />
            </>
          }
        />

        <Route
          path="/edit-activity/:id"
          element={
            <>
              <PageTitle title="Edit Activity | Best Activity Management Software" />
              <AddEditActivity />
            </>
          }
        />

        {/* View Activity Page */}
        <Route
          path="/view-activity/:id"
          element={
            <>
              <PageTitle title="View Activity | Best Activity Management Software" />
              <ActivityDetails />
            </>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
