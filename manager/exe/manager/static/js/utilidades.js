document.addEventListener('DOMContentLoaded', function() {

	if (typeof jQuery.fn.select2 !== 'undefined') {
		Array.from(document.querySelectorAll('.select2-single, .select2-group')).forEach(function(element) {
			new Select2(element, {
				language: "pt-BR"
			});
		});
	}

	if (typeof jQuery.fn.daterangepicker !== 'undefined') {
		Array.from(document.querySelectorAll('input[data-inputpicker="single"]')).forEach(function(input) {
			new DateRangePicker(input, {
				singleDatePicker: true,
				singleClasses: "picker_1",
				locale: {
					format: "YYYY-MM-DD",
					separator: " - ",
					applyLabel: "Aplicar",
					cancelLabel: "Cancelar",
					daysOfWeek: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"],
					monthNames: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
					firstDay: 1
				}
			});
		});
	}

	if (typeof jQuery.fn.inputmask !== 'undefined') {
		$('input.money').inputmask("currency", {radixPoint: '.'});
		$('input.money-br').inputmask("currency", {numericInput: true, radixPoint: ',', removeMaskOnSubmit:true,
			onBeforeMask: function (value, opts) {
				var processedValue;
				if(value.length)
					processedValue = value.replace('.', ',');
				else
					processedValue = value;

				return processedValue;
			},
			onUnMask: function(maskedValue, unmaskedValue) {
    			return maskedValue.replace('.','').replace(',','.');
  			}
		});
		$('input.only-number').inputmask({mask: '9{*}'});
		$('input.alphanumeric').inputmask({mask: '*{1,20}'});
		$('input.phone').inputmask({mask: '(99) 9999-9999[9]', greedy: false});
		$('input.cellphone').inputmask({mask: '(99) 99999-9999', greedy: false});
		$('input.cnpj').inputmask({mask: '99.999.999/9999-99'});
		$('input.cpf').inputmask({mask: '999.999.999-99'});
		$('input.cep').inputmask({mask: '99.999-999'});
		$('input.ncm').inputmask({mask: '9999.99.99'});
		$('input.cest').inputmask({mask: '99.999.99'});
		$('input.decimal').inputmask("currency", {radixPoint: '.', radixPoint: ',', rightAlign: false, prefix: "", digits: 0, groupSeparator: '.'});
	}

	document.querySelectorAll('table[count]').forEach(function(table) {
		Array.from(table.querySelectorAll('input, select')).forEach(function(element) {
			element.setAttribute('name', '_' + element.getAttribute('data-name'));
			element.disabled = true;
		});
	});

	document.querySelectorAll('form').forEach(function(form) {
		Array.from(form.querySelectorAll('textarea')).forEach(function(textarea) {
			let thiz = textarea;
			if (thiz.classList.contains('text-uppercase')) {
				thiz.value = thiz.value.toUpperCase();
				thiz.textContent = thiz.textContent.toUpperCase();
			}

			if (thiz.classList.contains('text-no-emoji')) {
				thiz.value = thiz.value.replace(/[^\p{L}\p{N}\p{P}\p{Z}^$\n]/gu, '');
			}
		});

		Array.from(form.querySelectorAll('input')).forEach(function(input) {
			let thiz = input;
			if (thiz.classList.contains('text-uppercase')) {
				thiz.value = thiz.value.toUpperCase();
			}
			if (thiz.classList.contains('text-no-emoji')) {
				thiz.value = thiz.value.replace(/[^\p{L}\p{N}\p{P}\p{Z}^$\n]/gu, '');
			}
		});
	});

	$('button[name=nova_linha]').click(function(){
		let group = $(this).attr('data-group');
		if(!group) return;

		let table = $('table[name=' + group + ']');
		let count = parseInt(table.attr('count'));
		let tr_first = $(table).find('tbody tr:first');

		let tr_new = tr_first.clone().appendTo(table);

		tr_new.removeClass('d-none');

		$(tr_new).find('input,select').each(function(){
			let thiz = $(this).prop('disabled', false);

			let new_name = group+'['+count+']['+thiz.attr('data-name')+']';
			thiz.attr('name', new_name).attr('id', new_name).removeAttr('data-name').attr('data-index', count);
			if(thiz.is('[data-required]')) {
				thiz.attr('required', 'required').removeAttr('data-required');
			}
			if(thiz.is('[data-load]')) {
				let new_load = group+'['+count+']['+thiz.attr('data-load')+']';
				thiz.attr('data-load', new_load);
			}
			if(thiz.is('[disabled-by]')) {
				let new_disabled = group+'['+count+']['+thiz.attr('disabled-by')+']';
				thiz.attr('disabled-by', new_disabled);
			}
			if(thiz.is('[loaded-by]')) {
				let new_disabled = group+'['+count+']['+thiz.attr('loaded-by')+']';
				thiz.attr('loaded-by', new_disabled);
			}

			if (typeof ($.fn.inputmask) !== 'undefined') {
				if(thiz.is('input.money')) 			 $(thiz).inputmask("currency", {radixPoint: '.'});
				else if(thiz.is('input.only-number')) $(thiz).inputmask({mask: '9{*}'});
				else if(thiz.is('input.phone'))		 $(thiz).inputmask({mask: '(99) 9999-9999[9]', greedy: false});
				else if(thiz.is('input.cnpj'))		 $(thiz).inputmask({mask: '99.999.999/9999-99'});
				else if(thiz.is('input.cpf'))		 $(thiz).inputmask({mask: '999.999.999-99'});
				else if(thiz.is('input.cep'))		 $(thiz).inputmask({mask: '99.999-999'});
				else if(thiz.is('input.decimal'))	 $(thiz).inputmask("currency", {radixPoint: '.', radixPoint: ',', rightAlign: false, prefix: "", digits: 0, groupSeparator: '.'});
			}
		});

		count++;

		table.attr('count', count);

		init_InputMask();

		// tr_new.searchForDisablingInputs();

		tr_new.find('button[name=deleta_linha]').click(function(){
			$(this).parents('tr').hide(100).remove();
		});
	});
});

$.fn.searchForDisablingInputs = function(){
	let t = $(this);
	t.find('[disables]').on('change', function(){
		let a = $(this);
		for(ab of $('[disabled-by ~="#'+a.attr('id')+'"],[disabled-by ~="'+a.attr('name')+'"]')){
			let b = $(ab);
			if(b.is('[disabled-with]')){
				if(a.val() == b.attr('disabled-with')){
					if(b.attr('type') == "text" || b.attr('type') == "select") {
						b.prop('readonly', true);
					}else{
						b.prop('disabled', true);
					}
					if(b.attr('required')) {
						b.attr('data-required', 'required').removeAttr('required');
					// }else if(b.attr('data-required')){
					// 	b.attr('required', 'required').removeAttr('data-required');
				}
			}else{
				if(b.attr('type') == "text" || b.attr('type') == "select") {
					b.prop('readonly', false);
				}else{
					b.prop('disabled', false);
				}
					// if(b.attr('required')) {
					// 	b.attr('data-required', 'required').removeAttr('required');
					// }else 
					if(b.attr('data-required')){
						b.attr('required', 'required').removeAttr('data-required');
					}
				}
			}else
			if(b.is('[enabled-with]')){
				if(a.val() == b.attr('enabled-with')){
					b.prop('disabled', false);
					if(b.attr('data-required')) {
						b.attr('required', 'required').removeAttr('data-required');
					}
				}else{
					b.prop('disabled', true).val();
					if(b.attr('required')) {
						b.attr('data-required', 'required').removeAttr('required');
					}
				}
			}
		}
	});
}

function slugify(string) {
	return string.toLowerCase()
	.replace(/[àÀáÁâÂãäÄÅåª]+/g, 'a')       // Special Characters #1
	.replace(/[èÈéÉêÊëË]+/g, 'e')       	// Special Characters #2
	.replace(/[ìÌíÍîÎïÏ]+/g, 'i')       	// Special Characters #3
	.replace(/[òÒóÓôÔõÕöÖº]+/g, 'o')       	// Special Characters #4
	.replace(/[ùÙúÚûÛüÜ]+/g, 'u')       	// Special Characters #5
	.replace(/[ýÝÿŸ]+/g, 'y')       		// Special Characters #6
	.replace(/[ñÑ]+/g, 'n')       			// Special Characters #7
	.replace(/[çÇ]+/g, 'c')       			// Special Characters #8
	.replace(/[ß]+/g, 'ss')       			// Special Characters #9
	.replace(/[Ææ]+/g, 'ae')       			// Special Characters #10
	.replace(/[Øøœ]+/g, 'oe')       		// Special Characters #11
	.replace(/[%]+/g, 'pct')       			// Special Characters #12
	.replace(/\s+/g, '-')           		// Replace spaces with -
	.replace(/[^\w\-]+/g, '')       		// Remove all non-word chars
	.replace(/\-\-+/g, '-')         		// Replace multiple - with single -
	.replace(/^-+/, '')             		// Trim - from start of text
	.replace(/-+$/, '');            		// Trim - from end of text
}

function init_InputMask() {
	if (typeof Inputmask !== 'undefined') {
		Array.from(document.querySelectorAll('input')).forEach(function(input) {
			Inputmask().mask(input);
		});
	}
}

function getCNPJ(e) {
	let a = e;
	let val = a.inputmask.unmaskedvalue();
	let action = '/api/cnpj/' + val;

	if (validarCNPJ(val) == false) {
		return;
	}

	let group = (a.getAttribute('data-group')) ? a.getAttribute('data-group') : '';

	fetch(action)
	.then(response => response.json())
	.then(resposta => {
		let t = "html";
		if (a.parentElement.closest('tr')) {
			t = a.parentElement.closest('tr');
		}

		if (document.querySelector(t + " #nome_fantasia").value.trim() == '') document.querySelector(t + " #nome_fantasia").value = resposta.nome;
		document.querySelector(t + " #razao_social").value = resposta.nome;
		document.querySelector(t + " #end_cep").value = resposta.cep;
		document.querySelector(t + " #end_logradouro").value = resposta.logradouro;
		document.querySelector(t + " #end_bairro").value = resposta.bairro;
		document.querySelector(t + " #end_numero").value = resposta.numero;
		document.querySelector(t + " #end_estado").value = resposta.uf;
		document.querySelector(t + " #end_cidade").value = resposta.municipio;
		document.querySelector(t + " #end_complemento").value = resposta.complemento;

		if (document.querySelector(t + " #idpais")) {
			document.querySelector(t + " #idpais").value = 1;
			document.querySelector(t + " #idpais").dispatchEvent(new Event('change'));
		}

		console.log(resposta);
	})
	.catch(error => {
		console.log(error);
	});
}

function validarCNPJ(cnpj) {
	/* Remover caracteres especiais */
	cnpj = cnpj.replace(/[^\d]+/g, '');

	/* Verificar se possui 14 dígitos */
	if (cnpj.length !== 14) {
		return false;
	}

	/* Verificar se todos os dígitos são iguais */
	if (/^(\d)\1+$/.test(cnpj)) {
		return false;
	}

	/* Validar dígitos verificadores */
	var tamanho = cnpj.length - 2;
	var numeros = cnpj.substring(0, tamanho);
	var digitos = cnpj.substring(tamanho);
	var soma = 0;
	var pos = tamanho - 7;

	for (var i = tamanho; i >= 1; i--) {
		soma += numeros.charAt(tamanho - i) * pos--;
		if (pos < 2) {
			pos = 9;
		}
	}

	var resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);

	if (resultado !== parseInt(digitos.charAt(0), 10)) {
		return false;
	}

	tamanho += 1;
	numeros = cnpj.substring(0, tamanho);
	soma = 0;
	pos = tamanho - 7;

	for (var j = tamanho; j >= 1; j--) {
		soma += numeros.charAt(tamanho - j) * pos--;
		if (pos < 2) {
			pos = 9;
		}
	}

	resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);

	if (resultado !== parseInt(digitos.charAt(1), 10)) {
		return false;
	}

	return true;
}

function validarCPF(cpf) {
	/* Remover caracteres especiais */
	cpf = cpf.replace(/[^\d]+/g, '');

	/* Verificar se possui 11 dígitos */
	if (cpf.length !== 11) {
		return false;
	}

	/* Verificar se todos os dígitos são iguais */
	if (/^(\d)\1+$/.test(cpf)) {
		return false;
	}

	/* Validar dígitos verificadores */
	var soma = 0;
	var resto;

	for (var i = 1; i <= 9; i++) {
		soma += parseInt(cpf.charAt(i - 1)) * (11 - i);
	}

	resto = (soma * 10) % 11;

	if (resto === 10 || resto === 11) {
		resto = 0;
	}

	if (resto !== parseInt(cpf.charAt(9))) {
		return false;
	}

	soma = 0;

	for (var j = 1; j <= 10; j++) {
		soma += parseInt(cpf.charAt(j - 1)) * (12 - j);
	}

	resto = (soma * 10) % 11;

	if (resto === 10 || resto === 11) {
		resto = 0;
	}

	if (resto !== parseInt(cpf.charAt(10))) {
		return false;
	}

	return true;
}