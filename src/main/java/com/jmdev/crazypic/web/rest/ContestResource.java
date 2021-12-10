package com.jmdev.crazypic.web.rest;

import com.jmdev.crazypic.domain.Contest;
import com.jmdev.crazypic.repository.ContestRepository;
import com.jmdev.crazypic.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.jmdev.crazypic.domain.Contest}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ContestResource {

    private final Logger log = LoggerFactory.getLogger(ContestResource.class);

    private static final String ENTITY_NAME = "contest";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ContestRepository contestRepository;

    public ContestResource(ContestRepository contestRepository) {
        this.contestRepository = contestRepository;
    }

    /**
     * {@code POST  /contests} : Create a new contest.
     *
     * @param contest the contest to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new contest, or with status {@code 400 (Bad Request)} if the contest has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/contests")
    public ResponseEntity<Contest> createContest(@Valid @RequestBody Contest contest) throws URISyntaxException {
        log.debug("REST request to save Contest : {}", contest);
        if (contest.getId() != null) {
            throw new BadRequestAlertException("A new contest cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Contest result = contestRepository.save(contest);
        return ResponseEntity
            .created(new URI("/api/contests/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /contests/:id} : Updates an existing contest.
     *
     * @param id the id of the contest to save.
     * @param contest the contest to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated contest,
     * or with status {@code 400 (Bad Request)} if the contest is not valid,
     * or with status {@code 500 (Internal Server Error)} if the contest couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/contests/{id}")
    public ResponseEntity<Contest> updateContest(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Contest contest
    ) throws URISyntaxException {
        log.debug("REST request to update Contest : {}, {}", id, contest);
        if (contest.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, contest.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!contestRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Contest result = contestRepository.save(contest);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, contest.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /contests/:id} : Partial updates given fields of an existing contest, field will ignore if it is null
     *
     * @param id the id of the contest to save.
     * @param contest the contest to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated contest,
     * or with status {@code 400 (Bad Request)} if the contest is not valid,
     * or with status {@code 404 (Not Found)} if the contest is not found,
     * or with status {@code 500 (Internal Server Error)} if the contest couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/contests/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Contest> partialUpdateContest(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Contest contest
    ) throws URISyntaxException {
        log.debug("REST request to partial update Contest partially : {}, {}", id, contest);
        if (contest.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, contest.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!contestRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Contest> result = contestRepository
            .findById(contest.getId())
            .map(existingContest -> {
                if (contest.getName() != null) {
                    existingContest.setName(contest.getName());
                }
                if (contest.getStartDate() != null) {
                    existingContest.setStartDate(contest.getStartDate());
                }
                if (contest.getEndDate() != null) {
                    existingContest.setEndDate(contest.getEndDate());
                }
                if (contest.getUrl() != null) {
                    existingContest.setUrl(contest.getUrl());
                }
                if (contest.getUserId() != null) {
                    existingContest.setUserId(contest.getUserId());
                }

                return existingContest;
            })
            .map(contestRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, contest.getId().toString())
        );
    }

    /**
     * {@code GET  /contests} : get all the contests.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of contests in body.
     */
    @GetMapping("/contests")
    public List<Contest> getAllContests() {
        log.debug("REST request to get all Contests");
        return contestRepository.findAll();
    }

    /**
     * {@code GET  /contests/:id} : get the "id" contest.
     *
     * @param id the id of the contest to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the contest, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/contests/{id}")
    public ResponseEntity<Contest> getContest(@PathVariable Long id) {
        log.debug("REST request to get Contest : {}", id);
        Optional<Contest> contest = contestRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(contest);
    }

    /**
     * {@code DELETE  /contests/:id} : delete the "id" contest.
     *
     * @param id the id of the contest to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/contests/{id}")
    public ResponseEntity<Void> deleteContest(@PathVariable Long id) {
        log.debug("REST request to delete Contest : {}", id);
        contestRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
