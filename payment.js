document.addEventListener('DOMContentLoaded', function () {
    const paymentRadios = document.querySelectorAll('input[name="paymentType"]');
    const confirmPaymentButton = document.getElementById('confirmPayment');

    paymentRadios.forEach(radio => {
        radio.addEventListener('change', function () {
            // Fechar qualquer modal aberto
            const modals = ['cardModal', 'mbwayModal', 'bankTransferModal'];
            modals.forEach(modalId => {
                const modalElement = document.getElementById(modalId);
                if (modalElement) {
                    const modalInstance = bootstrap.Modal.getInstance(modalElement);
                    if (modalInstance) {
                        modalInstance.hide();
                    }
                }
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

    // Lidar com o clique em "Confirmar" no modal de Cartão
    document.getElementById('cardForm').addEventListener('submit', function (e) {
        e.preventDefault();
        const cardNumber = document.getElementById('cardNumber').value;
        const expiryDate = document.getElementById('expiryDate').value;
        const cvv = document.getElementById('cvv').value;

        if (!cardNumber.match(/^\d{16}$/) || !expiryDate.match(/^(0[1-9]|1[0-2])\/\d{2}$/) || !cvv.match(/^\d{3}$/)) {
            alert("Por favor, verifique os dados do cartão.");
            return;
        }

        // Preencher campos no formulário principal
        alert("Dados do cartão confirmados!");
        const modalInstance = bootstrap.Modal.getInstance(document.getElementById('cardModal'));
        if (modalInstance) modalInstance.hide();
    });

    // Lidar com o clique em "Confirmar" no modal de MB WAY
    document.getElementById('mbwayForm').addEventListener('submit', function (e) {
        e.preventDefault();
        const mbwayPhone = document.getElementById('mbwayPhone').value;

        if (!mbwayPhone.match(/^9\d{8}$/)) {
            alert("Número MB WAY inválido!");
            return;
        }

        // Preencher campos no formulário principal
        alert("Dados MB WAY confirmados!");
        const modalInstance = bootstrap.Modal.getInstance(document.getElementById('mbwayModal'));
        if (modalInstance) modalInstance.hide();
    });

    // Confirmar pagamento principal
    confirmPaymentButton.addEventListener('click', function () {
        const selectedPaymentType = document.querySelector('input[name="paymentType"]:checked');

        if (!selectedPaymentType) {
            alert("Por favor, selecione um tipo de pagamento!");
            return;
        }

        // Confirmar os dados do pagamento e submeter
        alert("Pagamento confirmado com sucesso!");
    });
});
