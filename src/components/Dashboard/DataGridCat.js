import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Typography } from '@mui/material';
import { fontSize } from '@mui/system';
import Cookies from 'js-cookie';

const DataGridCat = ({ summedData }) => {
    const [totalQuantity, setTotalQuantity] = useState(0);
    const [totalValue, setTotalValue] = useState(0);
    const [mediaDesc, setTotalMediaDescValue] = useState(0);
    const [maxQuantity, setMaxQuantity] = useState(0);
    const [maxValue, setMaxValue] = useState(0);
    const [maxAveragePrice, setMaxAveragePrice] = useState(0);
    const [maxMediaDesc, setMaxMediaDesc] = useState(0);
    const [userRole, setUserRole] = useState('');
    const user = JSON.parse(Cookies.get('user'));
  
    const funcao = user ? user.funcao : '';
    useEffect(() => {
        setUserRole(funcao);
    }, [funcao]);
    
    useEffect(() => {
        
        if (Array.isArray(summedData) && summedData.length > 0) {
            const totalQuant = summedData.reduce((acc, item) => acc + item.quantidadeTotal, 0);
            const totalVal = summedData.reduce((acc, item) => acc + item.valorTotalPago, 0);
            const totalMediaDesc = summedData.reduce((acc, item) => acc + item.mediaDesconto, 0);
            const maxQuant = Math.max(...summedData.map(item => item.quantidadeTotal));
            const maxVal = Math.max(...summedData.map(item => item.valorTotalPago));
            const maxValDesc = Math.max(...summedData.map(item => item.mediaDesconto));
            
            const averagePrices = summedData
                .filter(item => item.quantidadeTotal > 0)
                .map(item => item.valorTotalPago / item.quantidadeTotal);

            const maxAvgPrice = averagePrices.length > 0 ? Math.max(...averagePrices) : 0;

            setTotalQuantity(totalQuant);
            setTotalValue(totalVal);
            setTotalMediaDescValue(totalMediaDesc);
            setMaxQuantity(maxQuant);
            setMaxValue(maxVal);
            setMaxAveragePrice(maxAvgPrice);
            setMaxMediaDesc(maxValDesc);
            
            
        }
    }, [summedData]);
  

    
    const sortedData = [...summedData].sort((a, b) => b.valorTotalPago - a.valorTotalPago);

    
    const ProgressBarCell = ({ value, maxValue, color, formattedValue }) => {
        const proportion = maxValue > 0 ? (value / maxValue) * 100 : 0;
        const width = Math.max(proportion, 5); 

        return (
            <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', marginTop: '5px', position: 'relative' }}>
                <Box
                    sx={{
                        
                        height: '18px',
                        width: `${width}%`,
                        backgroundColor: color,
                    }}
                />
                <Typography
                    variant="body2"
                    sx={{
                        position: 'absolute',
                        left: '2%',
                        zIndex: 1,
                        color: 'rgba(255, 255, 255, 0.9)',
                    }}
                >
                    {formattedValue}
                </Typography>
            </Box>
        );
    };

    
    const columns = [
        { field: 'marca', headerName: 'Marca', width: 65, 
            headerClassName: 'custom-header',
            cellClassName: 'custom-cell',  
            headerClassName: 'center-header', 
            cellClassName: 'center-cell',       
            renderCell: (params) => (
                <Typography sx={{ fontSize: 12, textAlign: 'center', width: '100%', marginTop:'5px'}}>
                    {params.value}
                </Typography>
            )
          }
          ,
        { field: 'catGestor_desc', headerName: 'Categoria', width: 85, 
            headerClassName: 'custom-header',
            cellClassName: 'custom-cell',  
            renderCell: (params) => (
                <Typography sx={{ fontSize: 12, marginTop:'5px' }}> 
                    {params.value}
                </Typography>
            )
           },
        { field: 'classGestor_desc', headerName: 'Artigo', width: 100, 
            headerClassName: 'custom-header',
            cellClassName: 'custom-cell',  
            renderCell: (params) => (
                <Typography sx={{ fontSize: 12, marginTop:'5px' }}> 
                    {params.value}
                </Typography>
            )
          },
        {
            field: 'valorTotalPago',
            headerName: 'Valor Total (Pago)',
            width: 120,
            renderHeader: () => (
                <div style={{ textAlign: 'center', whiteSpace: 'normal' }}>
                    <span>Valor Total</span><br />
                    <span>Pago</span>
                </div>
            ),
            renderCell: (params) => {
                const formattedValue = new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                }).format(params.row.valorTotalPago);
                return (
                    <ProgressBarCell
                        value={params.row.valorTotalPago}
                        maxValue={maxValue}
                        color="secondary.main"
                        formattedValue={formattedValue}
                    />
                );
            },
        },
        {
            field: 'quantidadeTotal',
            headerName: 'Quantidade Total',
            width: 120,
            renderHeader: () => (
                <div style={{ textAlign: 'center', whiteSpace: 'normal' }}>
                    <span>Quantidade</span><br />
                    <span>Total</span>
                </div>
            ),
            renderCell: (params) => (
                <ProgressBarCell
                    value={params.row.quantidadeTotal}
                    maxValue={maxQuantity}
                    color="primary.main"
                    formattedValue={params.row.quantidadeTotal}
                />
            ),
        },
        {
            field: 'precoMedio',
            headerName: 'Preço Médio',
            width: 120,
            renderCell: (params) => {
                const precoMedio = params.row.quantidadeTotal > 0 
                    ? params.row.valorTotalPago / params.row.quantidadeTotal 
                    : 0;
                
                const formattedAveragePrice = new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                }).format(precoMedio);
                
                return (
                    <ProgressBarCell
                        value={precoMedio}
                        maxValue={maxAveragePrice}
                        color="success.main"
                        formattedValue={formattedAveragePrice}
                    />
                );
            },
        },
        {
            field: 'mediaDesconto',  
            headerName: 'Média de Desconto',
            width: 120,
            field: 'mediaDesconto',  
            headerName: 'Média de Desconto',
            width: 130,
            renderHeader: () => (
                <div style={{ textAlign: 'center', whiteSpace: 'normal' }}>
                    <span>Média</span><br />
                    <span>de Desconto</span>
                </div>
            ),
            renderCell: (params) => {
                const mediaDesconto = params.row.mediaDesconto; 
                
                
                const percentageValue = mediaDesconto * 100; 
                const formattedAverageDiscount = `${percentageValue.toFixed(2)}%`; 
                return (
                    <ProgressBarCell
                        value={mediaDesconto}  
                        maxValue={maxMediaDesc}  
                        color="warning.main"  
                        formattedValue={formattedAverageDiscount}  
                    />
                );
            },
        },
       
    ];

    return (
        <DataGrid
    rows={sortedData} 
    columns={columns}
    getRowId={(row) => `${row.marca}-${row.catGestor_desc}-${row.classGestor_desc}`}
    disableSelectionOnClick
    initialState={{
        pagination: {
            paginationModel: {
                pageSize: funcao === 'Consultora' ? 10 : 16, 
            },
        },
    }}
    autoHeight
    pageSizeOptions={[10, 16]} 
    disableColumnMenu
    rowHeight={30}
/>

    );
};

export default DataGridCat;
