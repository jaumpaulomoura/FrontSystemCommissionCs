import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Typography } from '@mui/material';

const DataGridCat = ({ summedData }) => {
    const [totalQuantity, setTotalQuantity] = useState(0);
    const [totalValue, setTotalValue] = useState(0);
    const [maxQuantity, setMaxQuantity] = useState(0);
    const [maxValue, setMaxValue] = useState(0);

    // Calcular os totais gerais e os máximos
    useEffect(() => {
        if (Array.isArray(summedData) && summedData.length > 0) {
            const totalQuant = summedData.reduce((acc, item) => acc + item.quantidadeTotal, 0);
            const totalVal = summedData.reduce((acc, item) => acc + item.valorTotal, 0);
            const maxQuant = Math.max(...summedData.map(item => item.quantidadeTotal));
            const maxVal = Math.max(...summedData.map(item => item.valorTotal));

            setTotalQuantity(totalQuant);
            setTotalValue(totalVal);
            setMaxQuantity(maxQuant);
            setMaxValue(maxVal);
        }
    }, [summedData]);

    // Ordenar os dados pelo quantidadeTotal (maior para menor)
    const sortedData = [...summedData].sort((a, b) => b.valorTotal - a.valorTotal);

    // Definição das colunas do DataGrid
    const columns = [
        { field: 'marca', headerName: 'Marca', width: 90 },
        { field: 'catGestor_desc', headerName: 'Categoria', width: 100 },
        { field: 'classGestor_desc', headerName: 'Classe', width: 150 },
        {
            field: 'valorTotal',
            headerName: 'Valor Total (Pago)',
            width: 170,
            renderCell: (params) => {
                const valueProportion = maxValue > 0 ? (params.row.valorTotal / maxValue) * 100 : 0;
        
                // Formatação do valor com R$ e separador de milhar
                const formattedValue = new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                }).format(params.row.valorTotal);
        
                return (
                    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', marginTop: '10px', position: 'relative' }}>
                        <Box
                            sx={{
                                height: '20px',
                                width: `${valueProportion}%`,
                                backgroundColor: 'secondary.main',
                            }}
                        />
                        <Typography
                            variant="body2"
                            sx={{
                                position: 'absolute',
                                left: '10%',
                                zIndex: 1,
                            }}
                        >
                            {formattedValue}
                            {/* ({valueProportion.toFixed(2)}%) */}
                        </Typography>
                    </Box>
                );
            },
        }
,        
        {
            field: 'quantidadeTotal',
            headerName: 'Quantidade Total',
            width: 150,
            renderCell: (params) => {
                const quantityProportion = maxQuantity > 0 ? (params.row.quantidadeTotal / maxQuantity) * 100 : 0;

                return (
                    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', marginTop:'10px',position: 'relative' }}>
                        <Box
                            sx={{
                                height: '20px',
                                width: `${quantityProportion}%`,
                                backgroundColor: 'primary.main',
                              
                            }}
                        />
                        <Typography
                            variant="body2"
                            sx={{
                                position: 'absolute',
                                left: '10%',                               
                                zIndex: 1,
                            }}
                        >
                            {params.row.quantidadeTotal} 
                            {/* ({quantityProportion.toFixed(2)}%) */}
                        </Typography>
                    </Box>
                );
            },
        },
      
        // Outras colunas, se necessário
    ];

    return (
       
            <DataGrid
                rows={sortedData} // Use a lista ordenada
                columns={columns}
                getRowId={(row) => `${row.marca}-${row.catGestor_desc}-${row.classGestor_desc}`}
                disableSelectionOnClick
                initialState={{
                    pagination: {
                        paginationModel: {
                            pageSize: 10,
                        },
                    },
                }}
                autoHeight
                pageSizeOptions={[10]}
                disableColumnMenu
            />
       
    );
};

export default DataGridCat;
