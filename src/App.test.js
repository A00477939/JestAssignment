import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import App from './App';
import Item from './components/item'
import List from './components/list'

// Mock fetch globally
global.fetch = jest.fn();

beforeEach(() => {
  fetch.mockClear();
});



describe('Item Component test case', () => {
  it('toggles the capital on button click', () => {
    const { getByText, queryByText } = render(<Item name="Prince Edward Island" capital="Charlottetown"  />);
    expect(queryByText('Charlottetown')).toBeNull();
    fireEvent.click(getByText('Show Capital'));
    expect(getByText('Charlottetown')).toBeInTheDocument();
    fireEvent.click(getByText('Hide Capital'));
    expect(queryByText('Charlottetown')).toBeNull();
  });



  it('test for flag image alt tag name', () => {
    const flagUrl = "http://example.com/flag.jpg";
    const { getByAltText } = render(<Item name="Alberta" capital="Edmonton" flagUrl={flagUrl} />);
    const img = getByAltText("Alberta's Flag");
    expect(img).toBeInTheDocument();
    expect(img.src).toBe(flagUrl);
  });
});




it('Fetches and renders data on component mount', async () => {
  fetch.mockImplementationOnce(() =>
    Promise.resolve({
      json: () => Promise.resolve([{ name: "Manitoba", capital: "Winnipeg" }]),
    })
  );

  const { getByText } = render(<App />);
  expect(fetch).toHaveBeenCalledTimes(1);
  await waitFor(() => expect(getByText('Manitoba')).toBeInTheDocument());
});





describe('App Component', () => {

  it('updates content on menu item ', async () => {
    fetch.mockImplementation((url) =>
      Promise.resolve({
        json: () => Promise.resolve(url.includes('provinces') ? [{ name: "Nova Scotia" }] : [{ name: "Yukon" }]),
      })
    );

    const { getByText, rerender } = render(<App />);
    fireEvent.click(getByText('Territories'));
    await waitFor(() => expect(getByText('Yukon')).toBeInTheDocument());

    rerender(<App />);
    fireEvent.click(getByText('Provinces'));
    await waitFor(() => expect(getByText('Nova Scotia')).toBeInTheDocument());
  });
});


describe('List Component', () => {
  const provinces = [
    { name: "Ontario" },
    { name: "New Brunswick"}
  ];

  it('test case for multiple item components', () => {
    const { getByText } = render(<List data={provinces} />);
    expect(getByText('Ontario')).toBeInTheDocument();
    expect(getByText('New Brunswick')).toBeInTheDocument();
  });
});