document.addEventListener('DOMContentLoaded', function () {
    const paymentRadios = document.querySelectorAll('input[name="paymentType"]');
    const confirmPaymentButton = document.getElementById('confirmPayment');
    
    paymentRadios.forEach(radio => {
        radio.addEventListener('change', function () {
            // Fechar qualquer modal aberto
            const modals = ['cardModal', 'mbwayModal', 'bankTransferModal'];
            modals.forEach(modalId => {
                const modal = new bootstrap.Modal(document.getElementById(modalId));
                modal.hide();
            });

            // Exibir o modal específico
            if (this.id === 'paymentCard') {
                const cardModal = new bootstrap.Modal(document.getElementById('cardModal'));
                cardModal.show();
            } else if (this.id === 'paymentMbway') {
                const mbwayModal = new bootstrap.Modal(document.getElementById('mbwayModal'));
                mbwayModal.show();
            } else if (this.id === 'paymentBankTransfer') {
                const bankTransferModal = new bootstrap.Modal(document.getElementById('bankTransferModal'));
                bankTransferModal.show();
            }
        });
    });

    // Lidar com o clique no botão de "Confirmar Pagamento"
    confirmPaymentButton.addEventListener('click', function () {
        const selectedPaymentType = document.querySelector('input[name="paymentType"]:checked');
        
        if (!selectedPaymentType) {
            alert("Por favor, selecione um tipo de pagamento!");
            return;
        }

        alert("Pagamento confirmado com sucesso!");
    });
});
